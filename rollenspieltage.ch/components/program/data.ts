import { assert } from "@common/components/utils";
import type { ProgramDay } from "@common/utils/time";
import { getDay } from "@rst/components/anmeldung/constant/time";
import {
  loadProgram,
  type ProgramPublicEntry,
} from "@rst/components/anmeldung/api/program";

type GroupedByStarthour = Record<
  ProgramDay,
  Record<number, ProgramPublicEntry[]>
>;

export async function getProgramGroupedByStarthour(): Promise<GroupedByStarthour> {
  const program = await loadProgram("");

  assert(program.kind === "SUCCESS", "Could not load public program");

  const grouped: GroupedByStarthour = {
    FRIDAY: {},
    SATURDAY: {},
    SUNDAY: {},
  };

  for (const entry of program.data.publicEntries) {
    const { start } = entry.timeSlot.slot;
    const dayStr = getDay(start.day);
    if (dayStr === null) {
      continue;
    }
    const hour = Temporal.PlainTime.from(start.time).hour;
    const list = grouped[dayStr][hour] ?? [];
    list.push(entry);
    grouped[dayStr][hour] = list;
  }

  return grouped;
}
