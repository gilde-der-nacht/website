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
  unsafeToReservationUuid,
  unsafeToTimeslotUuid,
  type RegistrationUuid,
} from "@common/utils/ids";

/*
 * Types
 */

const reservationEntrySchema = z.object({
  name: z.string().nullable(),
  uuid: z.string().transform(unsafeToReservationUuid),
  timestamp: timestampSchema,
  groupId: z.string().transform(unsafeToGroupId),
});

export type ReservationEntry = z.infer<typeof reservationEntrySchema>;

const programPublicEntrySchema = z.object({
  uuid: z.string().transform(unsafeToGameUuid),
  status: publishStateSchema,
  myEntry: z.boolean(),
  title: z.string(),
  organizer: z.string(),
  shortDescription: z.string(),
  longDescription: z.string(),
  participation: z.object({
    seats: z.object({
      max: z.number(),
    }),
    reserved: z.array(
      z.object({
        name: z.union([z.string(), z.null()]),
        timestamp: timestampSchema,
        uuid: z.string().transform(unsafeToReservationUuid),
        groupId: z.string().transform(unsafeToGroupId),
      }),
    ),
    waiting: z.array(
      z.object({
        name: z.union([z.string(), z.null()]),
        timestamp: timestampSchema,
        uuid: z.string().transform(unsafeToReservationUuid),
        groupId: z.string().transform(unsafeToGroupId),
      }),
    ),
    history: z.array(
      z.object({
        kind: z.union([
          z.literal("ADD"),
          z.literal("REMOVE"),
          z.literal("UPDATE"),
        ]),
        name: z.union([z.string(), z.null()]),
        timestamp: timestampSchema,
        uuid: z.string().transform(unsafeToReservationUuid),
        groupId: z.string().transform(unsafeToGroupId),
      }),
    ),
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

const programSchema = z.object({
  publicEntries: z.array(programPublicEntrySchema),
  hiddenEntries: z.union([
    unauthorizedSchema,
    z.array(programHiddenEntrySchema),
  ]),
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
