import { z } from "astro:content";

const serverSchemaDay = z.enum(["SATURDAY", "SUNDAY"]);
type ProgramDay = z.infer<typeof serverSchemaDay>
const serverSchema = z.array(z.object({
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
type ProgramList = z.infer<typeof serverSchema>


export async function getProgram(): Promise<ProgramList> {
  const response = await fetch("https://elysium.gildedernacht.ch/rst24/program");
  const json = await response.json() as unknown;
  return serverSchema.parse(json);
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
