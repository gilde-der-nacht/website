import { elysiumLoadProgram } from "@rst/components/anmeldung/api/elysium";
import { mockedLoadProgram } from "@rst/components/anmeldung/api/mock";
import { daySchema } from "@rst/components/anmeldung/api/shared";
import type { ParseResult, Result } from "@rst/components/anmeldung/api/utils";
import { z } from "astro/zod";

/*
 * Types
 */

const programEntryServerSchema = z.object({
  uuid: z.string().uuid(),
  title: z.string(),
  system: z.string(),
  gamemaster: z.string(),
  description: z.object({
    short: z.string(),
    long: z.string(),
  }),
  slot: z.object({
    day: daySchema,
    from: z.number(),
    to: z.number(),
  }),
  playerCount: z.object({
    min: z.number(),
    max: z.number(),
    reserved: z.number(),
  }),
  tags: z.array(z.string()),
});
export type ProgramEntryServer = z.infer<typeof programEntryServerSchema>;

const programServerSchema = z.array(programEntryServerSchema);
export type ProgramServer = z.infer<typeof programServerSchema>;

const programEntryClientSchema = z.object({
  uuid: z.string().uuid(),
  title: z.string(),
  system: z.string(),
  gamemaster: z.string(),
  description: z.object({
    short: z.string(),
    long: z.string(),
  }),
  slot: z.object({
    day: daySchema,
    from: z.number(),
    to: z.number(),
  }),
  playerCount: z.object({
    min: z.number(),
    max: z.number(),
    reserved: z.number(),
  }),
  tags: z.array(z.string()),
});
export type ProgramEntryClient = z.infer<typeof programEntryClientSchema>;

const programClientSchema = z.array(programEntryClientSchema);
export type ProgramClient = z.infer<typeof programClientSchema>;

/*
 * Methods
 */

export async function loadProgram(
  secret: string,
): Promise<Result<ProgramClient>> {
  const program =
    secret === "demo"
      ? await mockedLoadProgram()
      : await elysiumLoadProgram(secret);

  if (program.kind === "FAILURE") {
    console.error("Unexpected error. Maybe network, maybe server error.");
    return {
      kind: "FAILURE",
    };
  }

  const parseResult = programServerSchema.safeParse(program.data);

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
  s: ProgramServer,
): ParseResult<ProgramClient> {
  return programClientSchema.safeParse(s);
}
