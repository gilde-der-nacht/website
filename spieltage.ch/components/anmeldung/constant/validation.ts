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

  const allErrors = Object.values(byField).flat();

  return {
    allErrors,
    byField,
    hasErrors: allErrors.length > 0,
  };
}
