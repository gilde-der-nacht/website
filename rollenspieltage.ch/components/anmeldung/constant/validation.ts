import {
  parseIntSafe,
  removeLeadingZeros,
  splitMultiple,
} from "@common/utils/parsing";
import { TXT } from "@common/utils/texts";
import type { ProgramDay } from "@common/utils/time";
import type { ProgramEntry } from "@rst/components/anmeldung/api/save";
import { getDay, openingHours } from "@rst/components/anmeldung/constant/time";

export const DESCR_SHORT_MAX_CHAR = 200;
export const DESCR_LONG_MAX_CHAR = 500;

export type Errors = {
  hasErrors: boolean;
  allErrors: string[];
  byField: Record<string, string[]>;
  byFieldUuid: Record<string, string[]>;
};

export function getErrors(
  entry: Omit<ProgramEntry, "uuid" | "status">,
): Errors {
  const byField: Record<string, string[]> = {};
  const byFieldUuid: Record<string, string[]> = {};

  if (entry.title.trim().length === 0) {
    byField["title"] = [
      ...(byField["title"] ?? []),
      "Titel ist ein Pflichtfeld",
    ];
  }

  if (entry.shortDescription.trim().length === 0) {
    byField["shortDescription"] = [
      ...(byField["shortDescription"] ?? []),
      "'Kurze Beschreibung' ist ein Pflichtfeld",
    ];
  }

  if (entry.shortDescription.trim().length > DESCR_SHORT_MAX_CHAR) {
    byField["shortDescription"] = [
      ...(byField["shortDescription"] ?? []),
      TXT.charLimitBy.replace("{}", String(DESCR_SHORT_MAX_CHAR)),
    ];
  }

  if (entry.longDescription.trim().length > DESCR_LONG_MAX_CHAR) {
    byField["longDescription"] = [
      ...(byField["longDescription"] ?? []),
      TXT.charLimitBy.replace("{}", String(DESCR_LONG_MAX_CHAR)),
    ];
  }

  if (
    (entry.seats.kind === "WITH_LIMIT" && entry.seats.max < 1) ||
    isNaN(entry.seats.max)
  ) {
    byField["seats"] = [...(byField["seats"] ?? []), TXT.minSeats];
  }

  if (entry.timeSlots.length === 0) {
    byField["timeSlots"] = [...(byField["timeSlots"] ?? []), TXT.missingSlot];
  } else {
    let hasTimeslotsErrors = false;
    entry.timeSlots.forEach((slot) => {
      const day = getDay(slot.slot.start.day);
      if (day === null) {
        hasTimeslotsErrors = true;
        byFieldUuid[slot.uuid] = [
          ...(byFieldUuid[slot.uuid] ?? []),
          "Fehler bei der Wahl des Tages. Dies sollte nicht passieren.",
        ];
        return;
      }
      const validatedTimeInput = validateTimeInput(
        slot.slot.start.time,
        slot.slot.end.time,
        day,
      );

      if (validatedTimeInput.kind === "INVALID") {
        hasTimeslotsErrors = true;
        byFieldUuid[slot.uuid] = [
          ...(byFieldUuid[slot.uuid] ?? []),
          validatedTimeInput.reason,
        ];
      }
    });

    if (hasTimeslotsErrors) {
      byField["timeSlots"] = [
        ...(byField["timeSlots"] ?? []),
        "Fehler in einem der Zeitfenster",
      ];
    }
  }

  entry.links.forEach((link) => {
    if (link.label.trim().length === 0) {
      byField["links"] = [
        ...(byField["links"] ?? []),
        "Link ohne Label gefunden",
      ];
    }

    if (!link.link.startsWith("https://")) {
      byField["links"] = [
        ...(byField["links"] ?? []),
        "Alle Links müssen mit 'https://' starten",
      ];
    }
  });

  const allErrors = Object.values(byField).flat();

  return {
    allErrors,
    byField,
    byFieldUuid,
    hasErrors: allErrors.length > 0,
  };
}

/**
 * @param input: allowed formats: `\d`, `\d\d`, `\d.\d\d`, `\d\d.\d\d`, `\d:\d\d`, `\d\d:\d\d`
 */
function parseTimeInput(
  input: string,
): { kind: "SUCCESS"; hour: number; minute: number } | { kind: "ERROR" } {
  const [hourStr, minuteStr, ...rest] = splitMultiple(input, [".", ":"]);

  if (hourStr === undefined) {
    // Should never happen
    return { kind: "ERROR" };
  }

  if ((minuteStr ?? "00").length !== 2) {
    return { kind: "ERROR" };
  }

  if (rest.length > 0) {
    return { kind: "ERROR" };
  }

  const hour = parseIntSafe(removeLeadingZeros(hourStr));
  const minute = parseIntSafe(removeLeadingZeros(minuteStr ?? "0"));

  if (hour === null || minute === null) {
    return { kind: "ERROR" };
  }

  return { kind: "SUCCESS", hour, minute };
}

function getRelationToBreak(
  time: { hour: number; minute: number },
  breakTime: { from: number; to: number },
): "BEFORE" | "DURING" | "AFTER" {
  if (time.hour < breakTime.from) {
    return "BEFORE";
  }

  if (time.hour >= breakTime.to) {
    return "AFTER";
  }

  if (time.hour === breakTime.from && time.minute === 0) {
    return "BEFORE";
  }
  return "DURING";
}

function validateTimeInput(
  start: string,
  end: string,
  day: ProgramDay,
): { kind: "VALID" } | { kind: "INVALID"; reason: string } {
  // parsing validation
  const parsedStart = parseTimeInput(start);
  const parsedEnd = parseTimeInput(end);

  if (parsedStart.kind === "ERROR") {
    return {
      kind: "INVALID",
      reason:
        "Startzeit ist keine gültige Zeit. Gültige Formate: '9', '8.00' oder '03:00'.",
    };
  }
  if (parsedEnd.kind === "ERROR") {
    return {
      kind: "INVALID",
      reason:
        "Endzeit ist keine gültige Zeit. Gültige Formate: '9', '8.00' oder '03:00'.",
    };
  }

  // only full hours are allowed

  if (parsedStart.minute !== 0) {
    return {
      kind: "INVALID",
      reason:
        "Startzeit ist keine gültige Zeit. Spielrunden dürfen nur zu vollen Stunden starten.",
    };
  }
  if (parsedEnd.minute !== 0) {
    return {
      kind: "INVALID",
      reason:
        "Endzeit ist keine gültige Zeit. Spielrunden dürfen nur zu vollen Stunden enden.",
    };
  }

  // validate end after start

  const { hour: startHour, minute: startMinute } = parsedStart;
  const { hour: endHour, minute: endMinute } = parsedEnd;

  if (startHour > endHour) {
    return {
      kind: "INVALID",
      reason: "Startzeit muss früher sein, als die Endzeit.",
    };
  }

  if (startHour === endHour && startMinute > endMinute) {
    return {
      kind: "INVALID",
      reason: "Startzeit muss früher sein, als die Endzeit.",
    };
  }

  // validate not outside opening hours
  const hoursOfTheDay = openingHours[day];

  if (startHour < hoursOfTheDay.open.from) {
    return {
      kind: "INVALID",
      reason: `Startzeit ist zu früh. Der Event beginnt erst um ${hoursOfTheDay.open.from} Uhr.`,
    };
  }

  if (endHour > hoursOfTheDay.open.to) {
    return {
      kind: "INVALID",
      reason: `Endzeit ist zu spät. Der Event schliesst bereits um ${hoursOfTheDay.open.from} Uhr.`,
    };
  }

  // validate not overlapping with breaks
  let isDuringBreak = false;

  hoursOfTheDay.breaks.forEach((breakTime) => {
    const startRel = getRelationToBreak(parsedStart, breakTime);
    const endRel = getRelationToBreak(parsedEnd, breakTime);

    if (startRel === "DURING" || endRel === "DURING") {
      isDuringBreak = true;
    }

    if (startRel !== endRel) {
      isDuringBreak = true;
    }
  });

  if (isDuringBreak) {
    return {
      kind: "INVALID",
      reason: `Das Zeitfenster überschneidet sich mit einer Pause. Es dürfen keine Spielrunden in den Pausen stattfinden. Die Pausen finden wie folgt statt: ${hoursOfTheDay.breaks.map((breakTime) => `${breakTime.from} - ${breakTime.to} Uhr`).join(" und ")}.`,
    };
  }

  return { kind: "VALID" };
}
