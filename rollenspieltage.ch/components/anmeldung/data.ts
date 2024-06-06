import { z } from "astro/zod";

const serverSchemaDay = z.enum(["SATURDAY", "SUNDAY"]);
type ProgramDay = z.infer<typeof serverSchemaDay>
const serverSchemaProgram = z.array(z.object({
  uuid: z.string(),
  description: z.nullable(z.string()),
  title: z.nullable(z.string()),
  system: z.string(),
  master: z.object({
    first: z.string(),
    last: z.nullable(z.string())
  }),
  playerCount: z.object({
    min: z.number(),
    max: z.number()
  }),
  slot: z.object({
    day: serverSchemaDay,
    start: z.number(),
    end: z.number()
  }),
}));
type ProgramList = z.infer<typeof serverSchemaProgram>

export async function getProgram(): Promise<ProgramList> {
  const response = await fetch("https://elysium.gildedernacht.ch/rst24/program");
  const json = await response.json() as unknown;
  return serverSchemaProgram.parse(json);
}

type GroupedByStarthour = Record<ProgramDay, Record<number, ProgramList>>;

export async function getProgramGroupedByStarthour(): Promise<GroupedByStarthour> {
  const program = await getProgram();

  const grouped: GroupedByStarthour = {
    SATURDAY: {},
    SUNDAY: {}
  };

  for (const entry of program) {
    const { day, start } = entry.slot;
    const list = grouped[day][start] ?? [];
    list.push(entry);
    grouped[day][start] = list;
  }

  return grouped;
}

const progressSchema = z.enum([
  "INITIALIZED",
  "IN_PROGRESS",
  "CONFIRMED",
  "CONFIRMED_W_INVALID_CHANGES",
  "CONFIRMED_W_VALID_CHANGES",
  "RECONFIRMED",]
);

const reservationSelfSchema = z.object({
  game: z.string(),
  self: z.literal(true),
  spielerName: z.null(),
})

const reservationFriendSchema = z.object({
  game: z.string(),
  self: z.literal(false),
  spielerName: z.string(),
})

const reservationFromServerSchema = z.union([
  reservationSelfSchema.extend({
    id: z.number(),
  }),
  reservationFriendSchema.extend({
    id: z.number(),
  })
]);

const reservationToServerSchema = z.union([
  reservationSelfSchema,
  reservationFriendSchema
]);
export type ReservationToServer = z.infer<typeof reservationToServerSchema>;

const saveFromServerSchema = z.object({
  registrationId: z.number(),
  progress: progressSchema,
  name: z.string(),
  email: z.string(),
  handynummer: z.string(),
  wantsEmailUpdates: z.boolean(),
  games: z.array(reservationFromServerSchema),
  lastSaved: z.string()
});

const saveToServerSchema = z.object({
  registrationId: z.number(),
  progress: progressSchema,
  name: z.string(),
  email: z.string(),
  handynummer: z.string(),
  wantsEmailUpdates: z.boolean(),
  games: z.array(reservationToServerSchema),
  lastSaved: z.string()
});

export type SaveFromServer = z.infer<typeof saveFromServerSchema>;
export type SaveToServer = z.infer<typeof saveToServerSchema>;
export type UpdateSave = <T extends keyof SaveFromServer>(prop: T, value: SaveFromServer[T]) => void;


export async function loadSave(secret: string): Promise<{ kind: "SUCCESS", save: SaveFromServer } | { kind: "FAILED" }> {
  const loadUrl = new URL("https://elysium.gildedernacht.ch/rst24/load");
  loadUrl.searchParams.append("secret", secret);
  const response = await fetch(loadUrl);
  if (!response.ok) {
    return { kind: "FAILED" };
  }
  const json = (await response.json()) as unknown;
  const parsed = saveFromServerSchema.safeParse(json);
  if (!parsed.success) {
    return { kind: "FAILED" };
  }

  return { kind: "SUCCESS", save: parsed.data }
}

const programEntrySchema = z.object({
  uuid: z.string(),
  title: z.nullable(z.string()),
  system: z.string(),
  description: z.nullable(z.string()),
  playerCount: z.object({ min: z.number(), max: z.number() }),
  master: z.object({ first: z.string(), last: z.nullable(z.string()) }),
  slot: z.object({ day: serverSchemaDay, start: z.number(), end: z.number() }),
})
export type ProgramEntry = z.infer<typeof programEntrySchema>;

const reservedSchema = z.union(
  [
    z.object({
      id: z.number(),
      game: z.string(),
      self: z.literal(true),
      spielerName: z.null(),
    }),
    z.object({
      id: z.number(),
      game: z.string(),
      self: z.literal(false),
      spielerName: z.string(),
    })]
);
export type ReservedEntry = z.infer<typeof reservedSchema>;

export async function loadProgram(): Promise<{ kind: "SUCCESS", program: { gameList: ProgramEntry[], reservedList: ReservedEntry[] } } | { kind: "FAILED" }> {
  const programUrl = new URL("https://elysium.gildedernacht.ch/rst24/program");
  const reservedUrl = new URL("https://elysium.gildedernacht.ch/rst24/reserved");
  const [programResponse, reservedResponse] = await Promise.all([
    fetch(programUrl), fetch(reservedUrl)
  ])

  if (!programResponse.ok) {
    return { kind: "FAILED" };
  }
  if (!reservedResponse.ok) {
    return { kind: "FAILED" };
  }

  const programJson = await programResponse.json() as unknown;
  const reservedJson = await reservedResponse.json() as unknown;

  const parsedProgram = z.array(programEntrySchema).safeParse(programJson);
  if (!parsedProgram.success) {
    return { kind: "FAILED" };
  }

  const parsedReserved = z.array(reservedSchema).safeParse(reservedJson);
  if (!parsedReserved.success) {
    return { kind: "FAILED" };
  }

  return {
    kind: "SUCCESS", program: {
      gameList: parsedProgram.data,
      reservedList: parsedReserved.data
    }
  }
}

export type Program = { gameList: ProgramEntry[], reservedList: ReservedEntry[] };
export type ProgramEntryExtended = {
  uuid: string,
  title: string | null,
  system: string,
  description: null | string,
  playerCount: { min: number, max: number },
  master: { first: string, last: string | null },
  slot: { day: ProgramDay, start: number, end: number },
  reservedIds: number[]
}

export type ProgramByHour = [hour: string, entries: ProgramEntryExtended[]][]
export function getByDayAndHour(day: ProgramDay, program: Program): ProgramByHour {
  const gamesOfChosenDay = program.gameList.filter(game => game.slot.day === day);
  const gamesExtended = gamesOfChosenDay.map(game => {
    const gameId = game.uuid;
    const reserved = program.reservedList.filter(reserved => reserved.game === gameId);
    return {
      ...game,
      reservedIds: reserved.map(entry => entry.id)
    } satisfies ProgramEntryExtended;
  });
  let grouped: Record<number, ProgramEntryExtended[]> = {};
  for (const entry of gamesExtended) {
    const { start } = entry.slot;
    const list: ProgramEntryExtended[] = grouped[start] ?? [];
    list.push(entry);
    grouped[start] = list;
  }
  return Object.entries(grouped);
}
