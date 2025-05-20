import { elysium } from "@common/components/utils";
import { z } from "astro/zod";

const serverSchemaDay = z.enum(["SATURDAY", "SUNDAY"]);
type ProgramDay = z.infer<typeof serverSchemaDay>;
const serverSchemaProgram = z.array(
  z.object({
    uuid: z.string(),
    description: z.nullable(z.string()),
    title: z.nullable(z.string()),
    master_name: z.string(),
    playercount: z.object({
      min: z.number(),
      max: z.number(),
    }),
    slot: z.object({
      day: serverSchemaDay,
      start: z.number(),
      end: z.number(),
    }),
    external_link: z.nullable(
      z.object({
        label: z.string(),
        link: z.string(),
      }),
    ),
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
