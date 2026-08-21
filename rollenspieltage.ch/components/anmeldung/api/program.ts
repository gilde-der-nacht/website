import { z } from "astro/zod";
import {
  elysiumLoadProgram,
  type Result,
} from "@rst/components/anmeldung/api/elysium";
import {
  durationSchema,
  publishStateSchema,
  timestampSchema,
  unauthorizedSchema,
} from "@common/utils/shared";
import { debounce } from "@common/components/utils";
import {
  unsafeToGameUuid,
  unsafeToGroupId,
  unsafeToRegistrationUuid,
  unsafeToReservationUuid,
  unsafeToTimeslotUuid,
  type RegistrationUuid,
} from "@common/utils/ids";

/*
 * Types
 */

const reservationEntrySchema = z.object({
  name: z.string().nullable(),
  waitinglistPreferences: z.union([
    z.literal("EXACTLY"),
    z.literal("SIMILAR"),
    z.literal("ANYTHING"),
  ]),
  uuid: z.string().transform(unsafeToReservationUuid),
  timestamp: timestampSchema,
  groupId: z.string().transform(unsafeToGroupId),
});

export type ReservationEntry = z.infer<typeof reservationEntrySchema>;

const reservationHistoryActionEntrySchema = z.object({
  kind: z.union([z.literal("ADD"), z.literal("REMOVE"), z.literal("UPDATE")]),
  waitinglistPreferences: z.union([
    z.literal("EXACTLY"),
    z.literal("SIMILAR"),
    z.literal("ANYTHING"),
  ]),
  name: z.union([z.string(), z.null()]),
  timestamp: timestampSchema,
  uuid: z.string().transform(unsafeToReservationUuid),
  groupId: z.string().transform(unsafeToGroupId),
});

export type ReservationHistoryActionEntry = z.infer<
  typeof reservationHistoryActionEntrySchema
>;

const programPublicEntrySchema = z.object({
  uuid: z.string().transform(unsafeToGameUuid),
  status: publishStateSchema,
  myEntry: z.boolean(),
  title: z.string(),
  system: z.string(),
  organizer: z.string(),
  shortDescription: z.string(),
  longDescription: z.string(),
  participation: z.object({
    seats: z.object({
      max: z.number(),
    }),
    reserved: z.array(reservationEntrySchema),
    waiting: z.array(reservationEntrySchema),
    history: z.array(reservationHistoryActionEntrySchema),
  }),
  timeSlot: z.object({
    uuid: z.string().transform(unsafeToTimeslotUuid),
    slot: durationSchema,
  }),
  tagNames: z.array(z.string()),
  language: z.union([z.literal("Deutsch"), z.literal("Englisch")]),
  links: z.array(
    z.object({
      label: z.string(),
      link: z.string(),
    }),
  ),
  secretForEditing: z.union([unauthorizedSchema, z.string()]),
  isClosed: z.boolean(),
});

export type ProgramPublicEntry = z.infer<typeof programPublicEntrySchema>;

const programHiddenEntrySchema = z.object({
  uuid: z.string().transform(unsafeToGameUuid),
  status: publishStateSchema,
  title: z.string(),
  organizer: z.string(),
  secretForEditing: z.union([unauthorizedSchema, z.string()]),
});

export type ProgramHiddenEntry = z.infer<typeof programHiddenEntrySchema>;

const wishlistEntrySchema = z.object({
  text: z.string(),
  author: z.string(),
  secret: z.string().transform(unsafeToRegistrationUuid),
});

export type WishlistEntry = z.infer<typeof wishlistEntrySchema>;

const programSchema = z.object({
  publicEntries: z.array(programPublicEntrySchema),
  hiddenEntries: z.union([
    unauthorizedSchema,
    z.array(programHiddenEntrySchema),
  ]),
  wishlist: z.union([unauthorizedSchema, z.array(wishlistEntrySchema)]),
});

export type Program = z.infer<typeof programSchema>;

/*
 * Methods
 */

export async function loadProgram(
  secret: RegistrationUuid | null,
): Promise<Result<Program>> {
  const program = await elysiumLoadProgram(secret);

  if (program.kind === "FAILURE") {
    console.error("Unexpected error. Maybe network, maybe server error.");
    return {
      kind: "FAILURE",
    };
  }

  const parseResult = programSchema.safeParse(program.data);

  if (!parseResult.success) {
    console.error(parseResult.error);
    return {
      kind: "FAILURE",
    };
  }

  return {
    kind: "SUCCESS",
    data: parseResult.data,
  };
}

export const debouncedLoadProgram = debounce(loadProgram, 1_000);
