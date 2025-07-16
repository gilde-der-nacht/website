import type { ParseResult, Result } from "@rst/components/anmeldung/api/utils";
import {
  mockedLoadSave,
  mockedSaveState,
} from "@rst/components/anmeldung/api/mock";
import { z } from "astro/zod";
import {
  gameroundEditServerSchema,
  gameroundEditClientSchema,
  transformGameroundFromClient,
} from "@rst/components/anmeldung/api/gameround-edit";
import { debounce, formatDateTime } from "@common/components/utils";
import { createStore, type Store } from "solid-js/store";
import type { SaveState } from "@rst/components/anmeldung/api/meta";
import { toast, updateToast } from "@common/components/Toast";
import {
  elysiumLoadSave,
  elysiumSaveState,
} from "@rst/components/anmeldung/api/elysium";
import { publishStateSchema } from "@rst/components/anmeldung/api/shared";

/*
 * Types
 */

/*
 * Contact
 */

const contactServerSchema = z.object({
  name: z.string(),
  email: z.string(),
  mobile: z.string(),
});

const contactClientSchema = z.object({
  name: z.string(),
  email: z.string(),
  mobile: z.string(),
});

export type ContactClient = z.infer<typeof contactClientSchema>;

/*
 * Playing
 */

const reservationServerSchema = z.union([
  z.object({
    kind: z.literal("SELF"),
    gameRound: z.string().uuid(),
    uuid: z.string().uuid(),
  }),
  z.object({
    kind: z.literal("FRIEND"),
    gameRound: z.string().uuid(),
    name: z.string(),
    uuid: z.string().uuid(),
  }),
]);

export const playingServerSchema = z.object({
  wantsUpdates: z.boolean(),
  reservations: z.array(reservationServerSchema),
});

const reservationClientSchema = z.union([
  z.object({
    kind: z.literal("SELF"),
    gameRound: z.string().uuid(),
    uuid: z.string().uuid(),
  }),
  z.object({
    kind: z.literal("FRIEND"),
    gameRound: z.string().uuid(),
    name: z.string(),
    uuid: z.string().uuid(),
  }),
]);
export type ReservationClient = z.infer<typeof reservationClientSchema>;

const reservationCreateClientSchema = z.union([
  z.object({
    kind: z.literal("SELF"),
    gameRound: z.string().uuid(),
  }),
  z.object({
    kind: z.literal("FRIEND"),
    gameRound: z.string().uuid(),
    name: z.string(),
  }),
]);
export type ReservationCreateClient = z.infer<
  typeof reservationCreateClientSchema
>;

const playingClientSchema = z.object({
  wantsUpdates: z.boolean(),
  reservations: z.array(reservationClientSchema),
});

export type PlayingClient = z.infer<typeof playingClientSchema>;

/*
 * Master
 */

export const masterServerSchema = z.object({
  games: z.array(gameroundEditServerSchema),
  wantsHelp: z.boolean(),
});

const masterClientSchema = z.object({
  games: z.array(gameroundEditClientSchema),
  wantsHelp: z.boolean(),
});
export type MasterClient = z.infer<typeof masterClientSchema>;

/*
 * Helping
 */

export const helpingServerSchema = z.object({});

const helpingClientSchema = z.object({});

/*
 * Everything
 */

export const saveServerSchema = z.object({
  version: z.literal(1),
  init: contactServerSchema,
  lastSaved: z.string(),
  playing: playingServerSchema,
  master: masterServerSchema,
  helping: helpingServerSchema,
  publishState: publishStateSchema,
});
export type SaveServer = z.infer<typeof saveServerSchema>;

export const saveClientSchema = z.object({
  version: z.literal(1),
  init: contactClientSchema,
  lastSaved: z.coerce.date(),
  playing: playingClientSchema,
  master: masterClientSchema,
  helping: helpingClientSchema,
  publishState: publishStateSchema,
});

export type SaveClient = z.infer<typeof saveClientSchema>;

type SaveResult = Result<SaveClient> | { kind: "SECRET_INVALID" };

/*
 * Methods
 */

export async function loadSave(secret: string): Promise<SaveResult> {
  if (secret.length !== 36 && secret.length !== "demo".length) {
    return { kind: "SECRET_INVALID" };
  }

  const save =
    secret === "demo" ? await mockedLoadSave() : await elysiumLoadSave(secret);

  if (save.kind === "FAILURE") {
    console.error("Unexpected error. Maybe network, maybe server error.");
    return {
      kind: "FAILURE",
    };
  }
  const parseResult = saveServerSchema.safeParse(save.data);

  if (!parseResult.success) {
    console.error(parseResult.error);
    return {
      kind: "FAILURE",
    };
  }
  const transformResult = transformSaveFromServer(parseResult.data);
  if (!transformResult.success) {
    return {
      kind: "FAILURE",
    };
  }

  return {
    kind: "SUCCESS",
    data: transformResult.data,
  };
}

function transformSaveFromServer(s: SaveServer): ParseResult<SaveClient> {
  return saveClientSchema.safeParse(s);
}

const toastId = crypto.randomUUID();
export async function saveState(
  store: Store<{ saveState: SaveState }>,
  save: SaveClient,
  secret: string,
): Promise<Result<Date>> {
  const [_, setStore] = createStore(store);
  setStore("saveState", "SAVING");
  toast("Am Speichern...", { uuid: toastId, dismissable: false });
  const now = new Date();
  save.lastSaved = now;
  const saveForServer = transformSaveFromClient(save);
  try {
    const result =
      secret === "demo"
        ? await mockedSaveState(saveForServer, secret)
        : await elysiumSaveState(saveForServer, secret);
    if (result.kind === "FAILURE") {
      throw Error("");
    }
  } catch (e) {
    setStore("saveState", "ERROR");
    console.error(e);
    updateToast(toastId, "Speichern war nicht möglich!", {
      kind: "danger",
      duration: 10_000,
      dismissable: true,
    });
    return {
      kind: "FAILURE",
    };
  }
  updateToast(toastId, `Zuletzt gespeichert um: ${formatDateTime(now)} Uhr`, {
    kind: "success",
    dismissable: true,
  });
  setStore("saveState", "IDLE");
  return {
    kind: "SUCCESS",
    data: now,
  };
}

function transformSaveFromClient(c: SaveClient): SaveServer {
  return {
    ...c,
    lastSaved: String(c.lastSaved),
    master: {
      ...c.master,
      games: c.master.games.map(transformGameroundFromClient),
    },
  };
}

export const debouncedSaveState = debounce(saveState, 1_000);
