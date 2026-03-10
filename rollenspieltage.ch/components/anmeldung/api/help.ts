import { z } from "astro/zod";
import type { ParseResult, Result } from "@rst/components/anmeldung/api/utils";
import { elysiumLoadHelp } from "@rst/components/anmeldung/api/elysium";

/*
 * Types
 */

const helpServerSchema = z.array(z.uuid());

type HelpServer = z.infer<typeof helpServerSchema>;

const helpClientSchema = z.array(z.uuid());

export type HelpClient = z.infer<typeof helpClientSchema>;

/*
 * Methods
 */

export async function loadHelp(secret: string): Promise<Result<HelpClient>> {
  const program = await elysiumLoadHelp(secret);

  if (program.kind === "FAILURE") {
    console.error("Unexpected error. Maybe network, maybe server error.");
    return {
      kind: "FAILURE",
    };
  }

  const parseResult = helpServerSchema.safeParse(program.data);

  if (!parseResult.success) {
    return {
      kind: "FAILURE",
    };
  }
  const transformResult = transformHelpFromServer(parseResult.data);

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

function transformHelpFromServer(s: HelpServer): ParseResult<HelpClient> {
  return helpClientSchema.safeParse(s);
}
