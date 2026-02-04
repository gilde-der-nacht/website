import { toast, updateToast } from "@common/components/Toast";
import { debounce, formatDateTime } from "@common/components/utils";
import { publishStateSchema } from "@common/utils/shared";
import {
  elysiumLoadSave,
  elysiumSaveState,
  type Result,
} from "@lst/components/anmeldung/api/elysium";
import { z } from "astro/zod";
import { createStore, type Store } from "solid-js/store";
import {
  rolesSchema,
  type SaveState,
} from "@lst/components/anmeldung/api/meta";
import { dateTimeWindowSchema } from "@common/utils/time";

const contactSchema = z.object({
  name: z.string(),
  email: z.string(),
  mobile: z.string(),
});
export type Contact = z.infer<typeof contactSchema>;

const erklaerbaerReservationSchema = z.object({
  kind: z.literal("ERKLAERBAER"),
  uuid: z.string().uuid(),
  slot: dateTimeWindowSchema,
});

export type ErklaerbaerReservation = z.infer<
  typeof erklaerbaerReservationSchema
>;

const helpingReservationSchema = z.union([
  z.object({
    kind: z.literal("SELF"),
    helpEntryUuid: z.string().uuid(),
    uuid: z.string().uuid(),
  }),
  z.object({
    kind: z.literal("FRIEND"),
    helpEntryUuid: z.string().uuid(),
    name: z.string(),
    uuid: z.string().uuid(),
  }),
  erklaerbaerReservationSchema,
]);
export type HelpingReservation = z.infer<typeof helpingReservationSchema>;

const programEntrySchema = z.object({});
const reservationEntrySchema = z.object({});

const saveSchema = z.object({
  version: z.literal(5),
  contact: contactSchema,
  config: z.object({
    wantsUpdates: z.boolean(),
  }),
  helping: z.array(helpingReservationSchema),
  program: z.object({
    organising: z.array(programEntrySchema),
    participating: z.array(reservationEntrySchema),
  }),
});

export type Save = z.infer<typeof saveSchema>;

const loadSaveSchema = z.object({
  kind: z.literal("SUCCESS"),
  status: publishStateSchema,
  roles: rolesSchema,
  data: saveSchema,
});

export type LoadSave = z.infer<typeof loadSaveSchema>;

type LoadSaveResult =
  | {
      kind: "SUCCESS";
      data: LoadSave;
    }
  | {
      kind: "FAILURE";
      reason: "SECRET_INVALID" | "PARSE_ERROR" | "GENERAL";
    };

export async function loadSave(secret: string): Promise<LoadSaveResult> {
  if (secret.length !== 36 && secret.length !== "demo".length) {
    return { kind: "FAILURE", reason: "SECRET_INVALID" };
  }

  const save = await elysiumLoadSave(secret);

  if (save.kind === "FAILURE") {
    console.error("Unexpected error. Maybe network, maybe server error.");
    return {
      kind: "FAILURE",
      reason: "GENERAL",
    };
  }
  const parseResult = loadSaveSchema.safeParse(save.data);

  if (!parseResult.success) {
    console.error(parseResult.error);
    return {
      kind: "FAILURE",
      reason: "PARSE_ERROR",
    };
  }

  return {
    kind: "SUCCESS",
    data: parseResult.data,
  };
}

const toastId = crypto.randomUUID();
async function saveState(
  store: Store<{ saveState: SaveState }>,
  save: Save,
  secret: string,
): Promise<Result<Date>> {
  const [_, setStore] = createStore(store);
  setStore("saveState", "SAVING");
  toast("Am Speichern...", { uuid: toastId, dismissable: false });
  const now = new Date();
  try {
    const result = await elysiumSaveState(save, secret);
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

export const debouncedSaveState = debounce(saveState, 1_000);
