import { assert } from "@common/components/utils";
import type { ProgramDay } from "@common/utils/time";
import {
  loadPublic,
  type PublicProgramEntry,
} from "@lst/components/anmeldung/api/public";
import { getDay } from "@lst/components/anmeldung/constant/time";

type GroupedByStarthour = Record<
  ProgramDay,
  Record<number, PublicProgramEntry[]>
>;

export async function getProgramGroupedByStarthour(): Promise<GroupedByStarthour> {
  const program = await loadPublic("");

  assert(program.kind === "SUCCESS", "Could not load public program");

  const grouped: GroupedByStarthour = {
    FRIDAY: {},
    SATURDAY: {},
    SUNDAY: {},
  };

  for (const entry of program.data.programEntries) {
    const { day, start } = entry.slot;
    const dayStr = getDay(day);
    if (dayStr === null) {
      continue;
    }
    const list = grouped[dayStr][start.hour] ?? [];
    list.push(entry);
    grouped[dayStr][start.hour] = list;
  }

  return grouped;
}
