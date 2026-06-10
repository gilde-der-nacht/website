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

/*
 * Types
 */

const programPublicEntrySchema = z.object({
  uuid: z.string(),
  status: publishStateSchema,
  myEntry: z.boolean(),
  title: z.string(),
  organizer: z.string(),
  shortDescription: z.string(),
  longDescription: z.string(),
  participation: z.object({
    seats: z.object({
      kind: z.union([z.literal("NO_LIMIT"), z.literal("WITH_LIMIT")]),
      max: z.number(),
    }),
    reserved: z.union([
      z.number(),
      z.array(
        z.object({
          name: z.string(),
          uuid: z.string(),
          timestamp: timestampSchema,
        }),
      ),
    ]),
    waiting: z.union([
      z.number(),
      z.array(
        z.object({
          name: z.string(),
          uuid: z.string(),
          timestamp: timestampSchema,
        }),
      ),
    ]),
  }),
  timeSlot: z.object({ uuid: z.string(), slot: durationSchema }),
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
  uuid: z.string(),
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
  secret: string | null,
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
