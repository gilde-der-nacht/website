import { parsePlainTime } from "@common/components/events";
import { TXT } from "@common/utils/texts";
import type { ProgramEntry } from "@lst/components/anmeldung/api/save";

export const DESCR_SHORT_MAX_CHAR = 200;
export const DESCR_LONG_MAX_CHAR = 500;

export type Errors = {
  hasErrors: boolean;
  allErrors: string[];
  byField: Record<string, string[]>;
};

export function getErrors(entry: ProgramEntry): Errors {
  const byField: Record<string, string[]> = {};

  if (entry.title.trim().length === 0) {
    byField["title"] = [
      ...(byField["title"] ?? []),
      "Titel ist ein Pflichtfeld",
    ];
  }

  if (entry.organizer.trim().length === 0) {
    byField["organizer"] = [
      ...(byField["organizer"] ?? []),
      "'Organisiert durch' ist ein Pflichtfeld",
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

  if (entry.timeSlots.length === 0) {
    byField["timeSlots"] = [...(byField["timeSlots"] ?? []), TXT.missingSlot];
  } else {
    entry.timeSlots.forEach((slot) => {
      const parsedStartTime = parsePlainTime(slot.start.time);
      if (parsedStartTime.kind === "ERROR") {
        byField["timeSlots"] = [
          ...(byField["timeSlots"] ?? []),
          "Fehler im Zeitslot, 'Start'",
        ];
      }
      const parsedEndTime = parsePlainTime(slot.end.time);
      if (parsedEndTime.kind === "ERROR") {
        byField["timeSlots"] = [
          ...(byField["timeSlots"] ?? []),
          "Fehler im Zeitslot, 'Ende'",
        ];
      }
      if (parsedStartTime.kind === "TIME" && parsedEndTime.kind === "TIME") {
        if (parsedEndTime.value.since(parsedStartTime.value).hours < 0) {
          byField["timeSlots"] = [
            ...(byField["timeSlots"] ?? []),
            "Zeitfenster fehlerhaft ('Ende' vor 'Start')",
          ];
        }
      }
    });
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
    hasErrors: allErrors.length > 0,
  };
}
