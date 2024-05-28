import { z } from "astro:content";

const ServerTagSchema = z.enum(["SAMSTAG", "SONNTAG"]);
const ServerSlotSchema = z.object({
  Tag: ServerTagSchema,
  Startzeit: z.string(),
  Endzeit: z.string(),
});
type ServerSlotSchema = z.infer<typeof ServerSlotSchema>;

const ServerSchema = z.object({
  data: z.array(z.object({
    id: z.number(),
    Titel: z.nullable(z.string()),
    System: z.string(),
    Beschreibung: z.nullable(z.string()),
    Spieleranzahl_Minimum: z.number(),
    Spieleranzahl_Maximum: z.number(),
    Master: z.object({
      Vorname: z.string(),
      Nachname: z.nullable(z.string())
    }),
    Slots: z.array(z.object({
      program_24_slot_id: ServerSlotSchema
    }))
  }))
});

type ServerSchema = z.infer<typeof ServerSchema>;
type ServerEntry = ServerSchema["data"][number];

type ProgramDay = "SATURDAY" | "SUNDAY";
type ProgramEntry = {
  identifier: { id: number, slot: string },
  title: string | null,
  system: string
  description: string | null,
  playerCount: { min: number, max: number },
  master: { first: string, last: string | null },
  slot: { day: ProgramDay, start: number, end: number },
}

function convert(server: ServerEntry, slot: ServerSlotSchema): ProgramEntry {
  const day = slot.Tag === "SAMSTAG" ? "SATURDAY" : "SUNDAY";
  const [startHour] = slot.Startzeit.split(":");
  const [endHour] = slot.Endzeit.split(":");

  const slotId = `${day}_${startHour}_${endHour}`;
  return {
    identifier: { id: server.id, slot: slotId },
    title: server.Titel,
    system: server.System,
    description: server.Beschreibung,
    playerCount: { min: server.Spieleranzahl_Minimum, max: server.Spieleranzahl_Maximum },
    master: { first: server.Master.Vorname, last: server.Master.Nachname },
    slot: { day, start: Number(startHour), end: Number(endHour) },
  }
}

export async function getProgram(): Promise<ProgramEntry[]> {
  const response = await fetch("https://olymp.gildedernacht.ch/items/program_24?fields=*.*.*");
  const json = await response.json() as unknown;
  const { data } = ServerSchema.parse(json);

  const program: ProgramEntry[] = [];

  for (const serverEntry of data) {
    for (const { program_24_slot_id: entry } of serverEntry.Slots) {
      program.push(convert(serverEntry, entry));
    }
  }

  return program;
}

type GroupedByStarthour = Record<ProgramDay, Record<number, ProgramEntry[]>>;

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
