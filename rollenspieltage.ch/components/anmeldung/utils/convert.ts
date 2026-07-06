import {
  plainDateToString,
  plainTimeToString,
  UNAUTHORIZED,
  type Duration,
  type DurationEdit,
} from "@common/utils/shared";
import type { ProgramPublicEntry } from "@rst/components/anmeldung/api/program";
import type { ProgramEntry } from "@rst/components/anmeldung/api/save";
import { Temporal } from "@js-temporal/polyfill";

export function parseDurationEdit(duration: DurationEdit): Duration | null {
  const { start, end } = duration;
  try {
    const day = Temporal.PlainDate.from(start.day);
    const startTime = Temporal.PlainTime.from(start.time);
    const endTime = Temporal.PlainTime.from(end.time);
    const duration = endTime.since(startTime);
    const hours = duration.hours;

    return {
      start: {
        day: plainDateToString(day),
        time: plainTimeToString(startTime),
      },
      duration: {
        hours: hours > 0 ? hours : 24 + hours,
      },
    };
  } catch (_) {
    return null;
  }
}

export function entryEditToPublic(
  entry: ProgramEntry,
  organizer: string,
): ProgramPublicEntry[] {
  const {
    uuid,
    status,
    title,
    seats,
    shortDescription,
    longDescription,
    tagNames,
    language,
    links,
  } = entry;

  return entry.timeSlots
    .map((timeSlot): ProgramPublicEntry | null => {
      const parsed = parseDurationEdit(timeSlot.slot);
      if (parsed === null) {
        return null;
      }

      return {
        uuid,
        status,
        myEntry: false,
        title,
        organizer,
        shortDescription,
        longDescription,
        participation: {
          seats,
          reserved: [],
          waiting: [],
          history: [],
        },
        timeSlot: { uuid: timeSlot.uuid, slot: parsed },
        tagNames: tagNames
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0),
        language,
        links,
        secretForEditing: UNAUTHORIZED,
      };
    })
    .filter((entry) => entry !== null)
    .toSorted(
      (a, b) =>
        Temporal.PlainDate.compare(
          a.timeSlot.slot.start.day,
          b.timeSlot.slot.start.day,
        ) ||
        Temporal.PlainTime.compare(
          a.timeSlot.slot.start.time,
          b.timeSlot.slot.start.time,
        ),
    );
}
