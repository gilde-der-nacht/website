import { toast, updateToast } from "@common/components/Toast";
import { debounce, formatDateTime } from "@common/components/utils";
import {
  durationEditSchema,
  publishStateSchema,
  timestampSchema,
} from "@common/utils/shared";
import {
  elysiumLoadSave,
  elysiumSaveState,
  type Result,
} from "@rst/components/anmeldung/api/elysium";
import { z } from "astro/zod";
import { createStore, type Store } from "solid-js/store";
import {
  rolesSchema,
  type SaveState,
} from "@rst/components/anmeldung/api/meta";
import {
  unsafeToGameUuid,
  unsafeToReservationUuid,
  unsafeToTimeslotUuid,
  unsafeToToastUuid,
  type RegistrationUuid,
} from "@common/utils/ids";

const programLinkSchema = z.object({
  label: z.string(),
  link: z.string(),
});

export type Link = z.infer<typeof programLinkSchema>;

const toastId = unsafeToToastUuid(crypto.randomUUID());

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

const contactSchema = z.object({
  name: z.string(),
  email: z.string(),
  mobile: z.string(),
});

export type Contact = z.infer<typeof contactSchema>;

const configSchema = z.object({
  wantsUpdates: z.boolean(),
});

const participatingSchema = z.object({
  entryUuid: z.string().transform(unsafeToTimeslotUuid),
  uuid: z.string().transform(unsafeToReservationUuid),
  timestamp: timestampSchema,
  name: z.union([
    z.object({ kind: z.literal("SELF") }),
    z.object({
      kind: z.literal("FRIEND"),
      friendsName: z.string(),
    }),
  ]),
});

export type Participating = z.infer<typeof participatingSchema>;

const timeSlotEditSchema = z.object({
  uuid: z.string().transform(unsafeToTimeslotUuid),
  slot: durationEditSchema,
});

export type TimeSlotEdit = z.infer<typeof timeSlotEditSchema>;

const programEntrySchema = z.object({
  uuid: z.string().transform(unsafeToGameUuid),
  status: publishStateSchema,
  title: z.string(),
  shortDescription: z.string(),
  longDescription: z.string(),
  seats: z.object({
    max: z.number(),
  }),
  timeSlots: z.array(timeSlotEditSchema),
  tagNames: z.string(),
  language: z.union([z.literal("Deutsch"), z.literal("Englisch")]),
  links: z.array(programLinkSchema),
});

export type ProgramEntry = z.infer<typeof programEntrySchema>;

const programSchema = z.object({
  organising: z.array(programEntrySchema),
  reserved: z.array(participatingSchema),
});

export const saveSchema = z.object({
  version: z.literal(3),
  contact: contactSchema,
  config: configSchema,
  program: programSchema,
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

export async function loadSave(
  secret: RegistrationUuid,
): Promise<LoadSaveResult> {
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
