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

  const allErrors = Object.values(byField).flat();

  return {
    allErrors,
    byField,
    hasErrors: allErrors.length > 0,
  };
}
