import type { RegistrationUuid } from "@common/utils/ids";
import { durationToTemporal, isOverlapping } from "@common/utils/time";
import type { ProgramPublicEntry } from "@rst/components/anmeldung/api/program";

export function getBookedEntries(
  program: ProgramPublicEntry[],
  secret: RegistrationUuid | null,
): ProgramPublicEntry[] {
  if (secret === null) {
    return [];
  }
  return program.filter(
    (entry) =>
      entry.myEntry ||
      [...entry.participation.reserved, ...entry.participation.waiting].some(
        (entry) => secret.startsWith(entry.groupId),
      ),
  );
}

export function getConflicts(
  baseEntry: ProgramPublicEntry,
  bookedEntries: ProgramPublicEntry[],
): string[] {
  const { slot } = baseEntry.timeSlot;
  const baseEntrySlot = durationToTemporal(slot);
  return bookedEntries
    .filter((bookedEntry) => {
      const bookedSlot = durationToTemporal(bookedEntry.timeSlot.slot);
      return (
        slot.start.day === bookedEntry.timeSlot.slot.start.day &&
        isOverlapping(baseEntrySlot, bookedSlot)
      );
    })
    .filter(
      (conflictEntry) =>
        conflictEntry.timeSlot.uuid !== baseEntry.timeSlot.uuid,
    )
    .map((entry) => {
      if (entry.system.length > 0) {
        return `${entry.title} (${entry.system})`;
      }
      return entry.title;
    });
}
