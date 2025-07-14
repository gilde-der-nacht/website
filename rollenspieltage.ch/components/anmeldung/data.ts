import { elysium } from "@common/components/utils";
import { z } from "astro/zod";
import { getDemoProgram, getDemoSave } from "./demo";
import {
  serverSchemaDay,
  type PerDay,
  type ProgramDay,
  type TimeRange,
} from "./utils/time";

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
  const response = await fetch(elysium("/rst24/program"));
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
  spielerName: z.null(),
});

const reservationFriendSchema = z.object({
  game: z.string(),
  self: z.literal(false),
  spielerName: z.string(),
});

const reservationFromServerSchema = z.union([
  reservationSelfSchema.extend({
    id: z.number(),
  }),
  reservationFriendSchema.extend({
    id: z.number(),
  }),
]);
export type ReservationFromServer = z.infer<typeof reservationFromServerSchema>;

const reservationToServerSchema = z.union([
  reservationSelfSchema,
  reservationFriendSchema,
]);
export type ReservationToServer = z.infer<typeof reservationToServerSchema>;

const gameMasterRoundNewSchema = z.object({
  titel: z.string(),
  system: z.string(),
  descriptionShort: z.string(),
  descriptionLong: z.string(),
  slots: z.object({
    SATURDAY: z.array(
      z.object({
        from: z.number(),
        to: z.number(),
      }),
    ),
    SUNDAY: z.array(
      z.object({
        from: z.number(),
        to: z.number(),
      }),
    ),
  }),
  playerCountMin: z.number(),
  playerCountMax: z.number(),
  tags: z.array(z.string()),
});
export type GameMasterRoundNew = z.infer<typeof gameMasterRoundNewSchema>;

const gameMasterRoundSchema = gameMasterRoundNewSchema.extend({
  uuid: z.string().uuid(),
});
export type GameMasterRound = z.infer<typeof gameMasterRoundSchema>;

const gameMasterSaveSchema = z.object({
  games: z.array(gameMasterRoundSchema),
});
export type GameMasterSave = z.infer<typeof gameMasterSaveSchema>;

const saveFromServerSchema = z.object({
  registrationId: z.number(),
  name: z.string(),
  email: z.string(),
  handynummer: z.string(),
  wantsEmailUpdates: z.boolean(),
  games: z.array(reservationFromServerSchema),
  gameMaster: gameMasterSaveSchema,
  lastSaved: z.string(),
});

const saveToServerSchema = z.object({
  registrationId: z.number(),
  name: z.string(),
  email: z.string(),
  handynummer: z.string(),
  wantsEmailUpdates: z.boolean(),
  games: z.array(reservationToServerSchema),
  lastSaved: z.string(),
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
  if (secret === "demo") {
    return {
      kind: "SUCCESS",
      save: getDemoSave(),
    };
  }
  const loadUrl = elysium("/rst24/load");
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

  return { kind: "SUCCESS", save: parsed.data };
}

const programEntrySchema = z.object({
  uuid: z.string(),
  title: z.nullable(z.string()),
  system: z.string(),
  description: z.nullable(z.string()),
  playerCount: z.object({ min: z.number(), max: z.number() }),
  master: z.object({ first: z.string(), last: z.nullable(z.string()) }),
  slot: z.object({ day: serverSchemaDay, start: z.number(), end: z.number() }),
});
export type ProgramEntry = z.infer<typeof programEntrySchema>;

const reservedSchema = z.object({
  id: z.number(),
  gameId: z.string(),
});
export type ReservedEntry = z.infer<typeof reservedSchema>;

export type OpeningHours = PerDay<{ open: TimeRange; breaks: TimeRange[] }>;
export type Program = {
  gameList: ProgramEntry[];
  reservedList: ReservedEntry[];
  openingHours: OpeningHours;
};

export type ProgramEntryExtended = {
  uuid: string;
  title: string | null;
  system: string;
  description: null | string;
  playerCount: { min: number; max: number };
  master: { first: string; last: string | null };
  slot: { day: ProgramDay; start: number; end: number };
  reservedIds: number[];
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
      (reserved) => reserved.gameId === gameId,
    );
    return {
      ...game,
      reservedIds: reserved.map((entry) => entry.id),
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
export async function loadProgram(demo: boolean): Promise<
  | {
      kind: "SUCCESS";
      program: Program;
    }
  | { kind: "FAILED" }
> {
  if (demo) {
    return {
      kind: "SUCCESS",
      program: getDemoProgram(),
    };
  }

  const programUrl = elysium("/rst24/program");
  const reservedUrl = elysium("/rst24/reserved");
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
      openingHours: {
        SATURDAY: {
          open: { from: 10, to: 24 },
          breaks: [
            {
              from: 13,
              to: 14,
            },
            {
              from: 18,
              to: 19,
            },
          ],
        },
        SUNDAY: {
          open: { from: 10, to: 18 },
          breaks: [
            {
              from: 13,
              to: 14,
            },
          ],
        },
      },
    },
  };
}
