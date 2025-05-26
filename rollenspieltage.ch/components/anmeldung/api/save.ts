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
import { debounce } from "@common/components/utils";
import { createStore, type Store } from "solid-js/store";
import type { SaveState } from "./meta";

/*
 * Types
 */

/*
 * Playing
 */

const playingServerSchema = z.object({
  wantsUpdates: z.boolean(),
});

const playingClientSchema = z.object({
  wantsUpdates: z.boolean(),
});

/*
 * Master
 */

const masterServerSchema = z.object({
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

const helpingServerSchema = z.object({});

const helpingClientSchema = z.object({});

/*
 * Everything
 */

export const saveServerSchema = z.object({
  uuid: z.string().uuid(),
  name: z.string(),
  email: z.string(),
  mobile: z.string(),
  lastSaved: z.string(),
  playing: playingServerSchema,
  master: masterServerSchema,
  helping: helpingServerSchema,
});
export type SaveServer = z.infer<typeof saveServerSchema>;

export const saveClientSchema = z.object({
  uuid: z.string().uuid(),
  name: z.string(),
  email: z.string(),
  mobile: z.string(),
  lastSaved: z.coerce.date(),
  playing: playingClientSchema,
  master: masterClientSchema,
  helping: helpingClientSchema,
});

export type SaveClient = z.infer<typeof saveClientSchema>;

type SaveResult = Result<SaveClient> | { kind: "SECRET_INVALID" };

/*
 * Methods
 */

export async function loadSave(secret: string): Promise<SaveResult> {
  if (secret !== "demo") {
    return {
      kind: "SECRET_INVALID",
    };
  }

  const save = await mockedLoadSave();
  const parseResult = saveServerSchema.safeParse(JSON.parse(save as string));

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

export async function saveState(
  store: Store<{ saveState: SaveState }>,
  save: SaveClient,
): Promise<Result<Date>> {
  const [_, setStore] = createStore(store);
  setStore("saveState", "SAVING");
  const now = new Date();
  save.lastSaved = now;
  const saveForServer = transformSaveFromClient(save);
  try {
    await mockedSaveState(saveForServer);
  } catch (e) {
    setStore("saveState", "ERROR");
    console.error(e);
    return {
      kind: "FAILURE",
    };
  }
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
