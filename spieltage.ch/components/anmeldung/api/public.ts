import { z } from "astro/zod";
import {
  elysiumLoadPublic,
  type Result,
} from "@lst/components/anmeldung/api/elysium";

/*
 * Types
 */

const programEntriesSchema = z.array(z.object({}));

const reservationsSchema = z.record(z.string(), z.number());
export type Reservations = z.infer<typeof reservationsSchema>;

const publicSchema = z.object({
  programEntries: programEntriesSchema,
  reservations: reservationsSchema,
});

export type Public = z.infer<typeof publicSchema>;

/*
 * Methods
 */

export async function loadPublic(): Promise<Result<Public>> {
  const program = await elysiumLoadPublic();

  if (program.kind === "FAILURE") {
    console.error("Unexpected error. Maybe network, maybe server error.");
    return {
      kind: "FAILURE",
    };
  }

  const parseResult = publicSchema.safeParse(program.data);

  if (!parseResult.success) {
    return {
      kind: "FAILURE",
    };
  }

  return {
    kind: "SUCCESS",
    data: parseResult.data,
  };
}
