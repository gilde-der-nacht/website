import type { JSX } from "solid-js";

export type Language = "de" | "en";

export type Category =
  | "gilde"
  | "spieltage"
  | "rollenspieltage"
  | "tabletoptage";

export type WithChildren = {
  children?: JSX.Element;
};

const dateFormat = new Intl.DateTimeFormat("de-CH", {
  dateStyle: "long",
});

export function formatDate(date: Date): string {
  return dateFormat.format(date);
}

const dateTimeFormat = new Intl.DateTimeFormat("de-CH", {
  timeStyle: "short",
  dateStyle: "long",
  timeZone: "Europe/Zurich",
});

export function formatDateTime(date: Date): string {
  return dateTimeFormat.format(date);
}

export function formatDateRange(from: Date, to: Date): string {
  const sameYear = from.getFullYear() === to.getFullYear();
  const sameMonth = from.getMonth() === to.getMonth();

  const endFormatter = new Intl.DateTimeFormat("de-CH", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  if (sameYear && sameMonth) {
    const startFormatter = new Intl.DateTimeFormat("de-CH", {
      day: "numeric",
    });
    return `${startFormatter.format(from)}. bis ${endFormatter.format(to)}`;
  }
  if (sameYear) {
    const startFormatter = new Intl.DateTimeFormat("de-CH", {
      day: "numeric",
      month: "long",
    });
    return `${startFormatter.format(from)} bis ${endFormatter.format(to)}`;
  }
  const startFormatter = new Intl.DateTimeFormat("de-CH", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return `${startFormatter.format(from)} bis ${endFormatter.format(to)}`;
}

type WithDate = { date: string | Date };
export function sortByDate(a: WithDate, b: WithDate): number {
  return new Date(b.date).getTime() - new Date(a.date).getTime();
}

export function isFutureDate(date: Date | string): boolean {
  const now = new Date();
  const entryDate = new Date(date);
  return now < entryDate;
}

export function isNotProduction(): boolean {
  return import.meta.env.DEV || import.meta.env.ENV === "test";
}

export function elysium(path: string): URL {
  return new URL(
    path,
    import.meta.env.PUBLIC_USE_LOCAL_ELYSIUM === "true"
      ? "http://localhost:1414"
      : "https://elysium.gildedernacht.ch",
  );
}

export function collectPairs<A, B>(pairs: [A, B][]): Map<A, B> {
  return new Map(pairs);
}

export function mapToObject<A, B>(map: Map<A, B>): { [k: string | number]: B } {
  return Object.fromEntries(map);
}

export function collectPairsToObject<A extends string | number, B>(
  pairs: [A, B][],
): { [P in A]: B } {
  return mapToObject(collectPairs(pairs)) as { [P in A]: B };
}

export function getNumberedKeys<A extends number>(obj: {
  [P in A]: unknown;
}): number[] {
  return Object.keys(obj).map((n) => Number.parseInt(n));
}

export function sortTwoNumbers(nums: [number, number]): [number, number] {
  return nums.toSorted((a, b) => a - b) as [number, number];
}

type UnpackUnionResult<T> = T[] extends { kind: string }[]
  ? T extends { kind: infer K }
    ? { kind: K; value: T extends { kind: K } ? T : never }
    : never
  : never;

export function unpackUnion<K extends string, T extends { kind: K }>(
  union: T,
): UnpackUnionResult<T> {
  const kind = union.kind;
  return { kind, value: union } as UnpackUnionResult<T>;
}
