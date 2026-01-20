import type { JSX } from "solid-js";
import type { SimpleDateTime } from "./events";

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

export function formatSimpleDate(date: SimpleDateTime): string {
  const d = new Date(
    date.startDate.year,
    date.startDate.month - 1,
    date.startDate.day,
    date.startTime?.hour ?? 0,
    date.startTime?.minute ?? 0,
  );
  return dateFormat.format(d);
}

const dateTimeFormat = new Intl.DateTimeFormat("de-CH", {
  timeStyle: "short",
  dateStyle: "long",
  timeZone: "Europe/Zurich",
});

export function formatDateTime(date: Date): string {
  return dateTimeFormat.format(date);
}

export function formatSimpleDateTime(date: SimpleDateTime): string {
  const d = new Date(
    date.startDate.year,
    date.startDate.month - 1,
    date.startDate.day,
    date.startTime?.hour ?? 0,
    date.startTime?.minute ?? 0,
  );
  return dateTimeFormat.format(d);
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

export function formatSimpleDateRange(date: SimpleDateTime): string {
  const sameYear =
    date.endDate === null || date.startDate.year === date.endDate.year;
  const sameMonth =
    date.endDate === null || date.startDate.month === date.endDate.month;

  const from = new Date(
    date.startDate.year,
    date.startDate.month - 1,
    date.startDate.day,
    date.startTime?.hour ?? 0,
    date.startTime?.minute ?? 0,
  );

  const to = new Date(
    (date.endDate ?? date.startDate).year,
    (date.endDate ?? date.startDate).month - 1,
    (date.endDate ?? date.startDate).day,
    date.endTime?.hour ?? 0,
    date.endTime?.minute ?? 0,
  );

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

export function ellipsis(text: string, limit: number): string {
  if (text.length < limit) {
    return text;
  }
  return text.substring(0, limit) + "...";
}

export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  callback: T,
  delay: number,
) {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    const p = new Promise<ReturnType<T>>((resolve, reject) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        try {
          let output = callback(...args);
          resolve(output);
        } catch (err) {
          if (err instanceof Error) {
            reject(err);
          }
          reject(new Error(`An error has occurred:${err}`));
        }
      }, delay);
    });
    return p;
  };
}

export type Queue<T> = {
  enqueue: (element: T) => number;
  dequeue: () => { kind: "QUEUE_EMPTY" } | { kind: "NEXT_ELEMENT"; data: T };
};

export function createQueue<T>(): Queue<T> {
  const queue: T[] = [];
  return {
    enqueue: (element: T) => queue.push(element),
    dequeue: () => {
      const nextElement = queue.shift();
      if (nextElement === undefined) {
        return { kind: "QUEUE_EMPTY" };
      }
      return { kind: "NEXT_ELEMENT", data: nextElement };
    },
  };
}

export function assert(
  condition: boolean,
  msg: string,
): asserts condition is true {
  if (!condition) {
    throw new Error(msg);
  }
}
