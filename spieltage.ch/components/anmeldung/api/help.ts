import { z } from "astro/zod";
import {
  elysiumLoadHelp,
  type Result,
} from "@lst/components/anmeldung/api/elysium";

/*
 * Types
 */

const helpSchema = z.array(z.string().uuid());

type Help = z.infer<typeof helpSchema>;

/*
 * Methods
 */

export async function loadHelp(secret: string): Promise<Result<Help>> {
  const program = await elysiumLoadHelp(secret);

  if (program.kind === "FAILURE") {
    console.error("Unexpected error. Maybe network, maybe server error.");
    return {
      kind: "FAILURE",
    };
  }

  const parseResult = helpSchema.safeParse(program.data);

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
