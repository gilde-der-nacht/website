import { elysium } from "@common/components/utils";
import { z } from "astro/zod";

const serverSchemaDay = z.enum(["SATURDAY", "SUNDAY"]);
type ProgramDay = z.infer<typeof serverSchemaDay>;
const serverSchemaProgram = z.array(
  z.object({
    uuid: z.string(),
    description: z.nullable(z.string()),
    title: z.nullable(z.string()),
    system: z.string(),
    master: z.object({
      first: z.string(),
      last: z.nullable(z.string()),
    }),
    playerCount: z.object({
      min: z.number(),
      max: z.number(),
    }),
    slot: z.object({
      day: serverSchemaDay,
      start: z.number(),
      end: z.number(),
    }),
  }),
);
export type ProgramList = z.infer<typeof serverSchemaProgram>;

export async function getProgram(): Promise<ProgramList> {
  const response = await fetch(elysium("/lst25/program"));
  const json = (await response.json()) as unknown;
  return serverSchemaProgram.parse(json);
}

type GroupedByStarthour = Record<ProgramDay, Record<number, ProgramList>>;

export async function getProgramGroupedByStarthour(): Promise<GroupedByStarthour> {
  const program = await getProgram();

  const grouped: GroupedByStarthour = {
    SATURDAY: {},
    SUNDAY: {},
  };

  for (const entry of program) {
    const { day, start } = entry.slot;
    const list = grouped[day][start] ?? [];
    list.push(entry);
    grouped[day][start] = list;
  }

  return grouped;
}

const reservationSelfSchema = z.object({
  game: z.string(),
  self: z.literal(true),
  player_name: z.null(),
});

const reservationFriendSchema = z.object({
  game: z.string(),
  self: z.literal(false),
  player_name: z.string(),
});

const reservationFromServerSchema = z.union([
  reservationSelfSchema.extend({
    uuid: z.string().uuid(),
  }),
  reservationFriendSchema.extend({
    uuid: z.string().uuid(),
  }),
]);
export type ReservationFromServer = z.infer<typeof reservationFromServerSchema>;

const reservationToServerSchema = z.union([
  reservationSelfSchema,
  reservationFriendSchema,
]);
export type ReservationToServer = z.infer<typeof reservationToServerSchema>;

const saveFromServerSchema = z.object({
  registration_uuid: z.string().uuid(),
  name: z.string(),
  email: z.string(),
  telephone: z.string(),
  wishes_updates: z.boolean(),
  games: z.array(reservationFromServerSchema),
  last_saved: z.string(),
});

const saveToServerSchema = z.object({
  registration_uuid: z.string().uuid(),
  name: z.string(),
  email: z.string(),
  telephone: z.string(),
  wishes_updates: z.boolean(),
  games: z.array(reservationToServerSchema),
  last_saved: z.string(),
});

export type SaveFromServer = z.infer<typeof saveFromServerSchema>;
export type SaveToServer = z.infer<typeof saveToServerSchema>;
export type UpdateSave = <T extends keyof SaveFromServer>(
  prop: T,
  value: SaveFromServer[T],
) => void;

export async function loadSave(
  secret: string,
): Promise<{ kind: "SUCCESS"; save: SaveFromServer } | { kind: "FAILED" }> {
  const loadUrl = elysium("/lst25/load");
  loadUrl.searchParams.append("secret", secret);
  const response = await fetch(loadUrl);
  if (!response.ok) {
    return { kind: "FAILED" };
  }
  const json = (await response.json()) as unknown;
  const parsed = saveFromServerSchema.safeParse(json);
  if (!parsed.success) {
    console.error(parsed.error);
    return { kind: "FAILED" };
  }

  return { kind: "SUCCESS", save: parsed.data };
}

const programEntrySchema = z.object({
  uuid: z.string(),
  title: z.string(),
  description: z.nullable(z.string()),
  playercount: z.object({ min: z.number(), max: z.number() }),
  master_name: z.string(),
  slot: z.object({ day: serverSchemaDay, start: z.number(), end: z.number() }),
});
export type ProgramEntry = z.infer<typeof programEntrySchema>;

const reservedSchema = z.object({
  uuid: z.string().uuid(),
  game_uuid: z.string().uuid(),
});
export type ReservedEntry = z.infer<typeof reservedSchema>;

export async function loadProgram(): Promise<
  | {
      kind: "SUCCESS";
      program: { gameList: ProgramEntry[]; reservedList: ReservedEntry[] };
    }
  | { kind: "FAILED" }
> {
  const programUrl = elysium("/lst25/program");
  const reservedUrl = elysium("/lst25/reserved");
  const [programResponse, reservedResponse] = await Promise.all([
    fetch(programUrl),
    fetch(reservedUrl),
  ]);

  if (!programResponse.ok) {
    return { kind: "FAILED" };
  }
  if (!reservedResponse.ok) {
    return { kind: "FAILED" };
  }

  const programJson = (await programResponse.json()) as unknown;
  const reservedJson = (await reservedResponse.json()) as unknown;

  const parsedProgram = z.array(programEntrySchema).safeParse(programJson);
  if (!parsedProgram.success) {
    return { kind: "FAILED" };
  }

  const parsedReserved = z.array(reservedSchema).safeParse(reservedJson);
  if (!parsedReserved.success) {
    return { kind: "FAILED" };
  }

  return {
    kind: "SUCCESS",
    program: {
      gameList: parsedProgram.data,
      reservedList: parsedReserved.data,
    },
  };
}

export type Program = {
  gameList: ProgramEntry[];
  reservedList: ReservedEntry[];
};
export type ProgramEntryExtended = {
  uuid: string;
  title: string;
  description: null | string;
  playercount: { min: number; max: number };
  master_name: string;
  slot: { day: ProgramDay; start: number; end: number };
  reserved_uuids: string[];
};

export type ProgramByHour = [hour: string, entries: ProgramEntryExtended[]][];
export function getByDayAndHour(
  day: ProgramDay,
  program: Program,
): ProgramByHour {
  const gamesOfChosenDay = program.gameList.filter(
    (game) => game.slot.day === day,
  );
  const gamesExtended = gamesOfChosenDay.map((game) => {
    const gameId = game.uuid;
    const reserved = program.reservedList.filter(
      (reserved) => reserved.game_uuid === gameId,
    );
    return {
      ...game,
      reserved_uuids: reserved.map((entry) => entry.uuid),
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
