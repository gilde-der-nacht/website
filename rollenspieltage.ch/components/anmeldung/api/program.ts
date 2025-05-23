import { z } from "astro/zod";
import type { ParseResult, Result } from "@rst/components/anmeldung/api/utils";
import { mockedLoadProgram } from "@rst/components/anmeldung/api/mock";
import { gameroundPublicServerSchema } from "@rst/components/anmeldung/api/gameround-public";

/*
 * Types
 */

export const publicProgramServerSchema = z.object({
  entries: z.array(gameroundPublicServerSchema),
});
export type PublicProgramServer = z.infer<typeof publicProgramServerSchema>;

export const publicProgramClientSchema = publicProgramServerSchema;
export type PublicProgramClient = z.infer<typeof publicProgramClientSchema>;

/*
 * Methods
 */

export async function loadProgram(
  secret: string,
): Promise<Result<PublicProgramClient>> {
  if (secret !== "demo") {
    return {
      kind: "FAILURE",
    };
  }

  const program = await mockedLoadProgram();
  const parseResult = publicProgramServerSchema.safeParse(program);

  if (!parseResult.success) {
    return {
      kind: "FAILURE",
    };
  }
  const transformResult = transformProgramFromServer(parseResult.data);
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

function transformProgramFromServer(
  s: PublicProgramServer,
): ParseResult<PublicProgramClient> {
  return publicProgramClientSchema.safeParse(s);
}
