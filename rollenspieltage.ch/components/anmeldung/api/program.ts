import { z } from "astro/zod";
import type { ParseResult, Result } from "@rst/components/anmeldung/api/utils";
import { mockedLoadProgram } from "@rst/components/anmeldung/api/mock";
import { elysiumLoadProgram } from "@rst/components/anmeldung/api/elysium";
import { daySchema } from "@rst/components/anmeldung/api/shared";
import { getHours, type PerDay } from "@rst/components/anmeldung/utils/time";
import { openingHours } from "@rst/components/anmeldung/constant/hours";

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

export async function loadAnonymousProgram(): Promise<Result<ProgramClient>> {
  const program = await elysiumLoadProgram();

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

/*
 * Helpers
 */

export function groupByDay(
  program: ProgramEntryClient[],
): PerDay<ProgramEntryClient[]> {
  const grouped = Object.groupBy(program, (entry) => entry.slot.day);
  return {
    SATURDAY: grouped.SATURDAY ?? [],
    SUNDAY: grouped.SUNDAY ?? [],
  };
}

export function sortByFromHour(
  program: PerDay<ProgramEntryClient[]>,
): PerDay<Record<number, ProgramEntryClient[]>> {
  function sort(a: ProgramEntryClient, b: ProgramEntryClient): number {
    const { from: fromA, to: toA } = a.slot;
    const { from: fromB, to: toB } = b.slot;
    return fromA === fromB ? toA - toB : fromA - fromB;
  }
  const saturdaySorted = program.SATURDAY.toSorted(sort);
  const sundaySorted = program.SUNDAY.toSorted(sort);

  const saturdayByHours = getHours(openingHours.SATURDAY.open).reduce<
    Record<number, ProgramEntryClient[]>
  >((acc, hour) => {
    acc[hour] = saturdaySorted.filter((entry) => entry.slot.from === hour);
    return acc;
  }, {});
  const sundayByHours = getHours(openingHours.SUNDAY.open).reduce<
    Record<number, ProgramEntryClient[]>
  >((acc, hour) => {
    acc[hour] = sundaySorted.filter((entry) => entry.slot.from === hour);
    return acc;
  }, {});

  return {
    SATURDAY: saturdayByHours,
    SUNDAY: sundayByHours,
  };
}
