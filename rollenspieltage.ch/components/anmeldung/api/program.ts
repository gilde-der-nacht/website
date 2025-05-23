import { z } from "astro/zod";
import type { Result } from "@rst/components/anmeldung/api/utils";
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
      success: false,
    };
  }

  const program = await mockedLoadProgram();
  const parseResult = publicProgramServerSchema.safeParse(program);

  if (!parseResult.success) {
    return {
      success: false,
    };
  }
  const transformResult = transformProgramFromServer(parseResult.data);
  if (!transformResult.success) {
    return {
      success: false,
    };
  }

  return {
    success: true,
    data: transformResult.data,
  };
}

function transformProgramFromServer(
  s: PublicProgramServer,
): Result<PublicProgramClient> {
  return publicProgramClientSchema.safeParse(s);
}
