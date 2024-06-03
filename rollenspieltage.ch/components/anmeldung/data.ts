import { z } from "astro:content";

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

const reserveSchema = z.union([
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
  }),
]);

const serverSaveSchema = z.object({
  registrationId: z.number(),
  progress: progressSchema,
  name: z.string(),
  email: z.string(),
  handynummer: z.string(),
  wantsEmailUpdates: z.boolean(),
  games: z.array(reserveSchema),
  lastSaved: z.string()
});
export type Save = z.infer<typeof serverSaveSchema>;
export type UpdateSave = <T extends keyof Save>(prop: T, value: Save[T]) => void;


export async function loadSave(secret: string): Promise<{ kind: "SUCCESS", save: Save } | { kind: "FAILED" }> {
  const loadUrl = new URL("https://elysium.gildedernacht.ch/rst24/load");
  loadUrl.searchParams.append("secret", secret);
  const response = await fetch(loadUrl);
  if (!response.ok) {
    return { kind: "FAILED" };
  }
  const json = (await response.json()) as unknown;
  const parsed = serverSaveSchema.safeParse(json);
  if (!parsed.success) {
    return { kind: "FAILED" };
  }

  return { kind: "SUCCESS", save: parsed.data }
}
