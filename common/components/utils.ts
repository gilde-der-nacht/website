import type { JSX } from "solid-js";
import { toTemporal, type EventDateTimeView } from "@common/components/events";
import { Intl as IntlP } from "@js-temporal/polyfill";

export type Language = "de" | "en";

export type Category =
  "gilde" | "spieltage" | "rollenspieltage" | "tabletoptage";

export type WithChildren<T = object> = {
  children?: JSX.Element;
} & T;

const dateFormat = new IntlP.DateTimeFormat("de-CH", {
  dateStyle: "long",
});

export function formatDate(date: Date): string {
  return dateFormat.format(date);
}

export function formatSimpleDate(date: EventDateTimeView): string {
  return dateFormat.format(toTemporal(date).startDate);
}

const dateTimeFormat = new IntlP.DateTimeFormat("de-CH", {
  timeStyle: "short",
  dateStyle: "long",
  timeZone: "Europe/Zurich",
});

export function formatDateTime(date: Date): string {
  return dateTimeFormat.format(date);
}

export function formatSimpleDateTime(date: EventDateTimeView): string {
  return dateTimeFormat.format(toTemporal(date).startDate);
}

export function formatDateRange(from: Date, to: Date): string {
  const sameYear = from.getFullYear() === to.getFullYear();
  const sameMonth = from.getMonth() === to.getMonth();

  const endFormatter = new IntlP.DateTimeFormat("de-CH", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  if (sameYear && sameMonth) {
    const startFormatter = new IntlP.DateTimeFormat("de-CH", {
      day: "numeric",
    });
    return `${startFormatter.format(from)}. bis ${endFormatter.format(to)}`;
  }
  if (sameYear) {
    const startFormatter = new IntlP.DateTimeFormat("de-CH", {
      day: "numeric",
      month: "long",
    });
    return `${startFormatter.format(from)} bis ${endFormatter.format(to)}`;
  }
  const startFormatter = new IntlP.DateTimeFormat("de-CH", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return `${startFormatter.format(from)} bis ${endFormatter.format(to)}`;
}

export function formatEventDateTime(date: EventDateTimeView): string {
  const sameYear =
    date.endDate === null || date.startDate.year === date.endDate.year;
  const sameMonth =
    date.endDate === null || date.startDate.month === date.endDate.month;

  const { startDate: from, endDate: to } = toTemporal(date);

  const endFormatter = new IntlP.DateTimeFormat("de-CH", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  if (sameYear && sameMonth) {
    const startFormatter = new IntlP.DateTimeFormat("de-CH", {
      day: "numeric",
    });
    return `${startFormatter.format(from)}. bis ${endFormatter.format(to)}`;
  }
  if (sameYear) {
    const startFormatter = new IntlP.DateTimeFormat("de-CH", {
      day: "numeric",
      month: "long",
    });
    return `${startFormatter.format(from)} bis ${endFormatter.format(to)}`;
  }
  const startFormatter = new IntlP.DateTimeFormat("de-CH", {
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

export function assert(condition: boolean, msg: string): asserts condition {
  if (!condition) {
    throw new Error(msg);
  }
}

function describe(v: unknown): string {
  if (v === null) {
    return "null";
  }
  if (Array.isArray(v)) {
    return "an array";
  }
  const name = (v as { constructor?: { name?: string } }).constructor?.name;
  if (name && name !== "Object") {
    return `an instance of ${name}`;
  }
  return `something of type ${typeof v}`;
}

export function isPlainObject(v: unknown): v is Record<string, unknown> {
  if (v === null || typeof v !== "object" || Array.isArray(v)) {
    return false;
  }
  const proto = Object.getPrototypeOf(v);
  return proto === Object.prototype || proto === null;
}

export function assertPlainObject(
  v: unknown,
  op: string,
): Record<string, unknown> {
  if (!isPlainObject(v)) {
    throw new Error(`${op}: value is ${describe(v)}, expected a plain object`);
  }
  return v;
}

export function isArray(value: unknown): value is Array<unknown> {
  return value !== null && typeof value === "object" && Array.isArray(value);
}

export function mapValues<T extends Record<string, unknown>, V>(
  rec: T,
  map: (value: T[keyof T], key: Extract<string, keyof T>) => V,
): { [K in keyof T]: V } {
  const out = {} as { [K in keyof T]: V };
  for (const key of Object.keys(rec)) {
    out[key as keyof T] = map(
      rec[key as keyof T],
      key as Extract<string, keyof T>,
    );
  }
  return out;
}

export function makeWalker<L>(
  isLeaf: (x: unknown) => x is L,
  onLeaf: (leaf: L) => unknown,
): (node: unknown) => unknown {
  const walk = (node: unknown): unknown => {
    if (isLeaf(node)) return onLeaf(node);
    if (Array.isArray(node)) return node.map(walk);
    if (isPlainObject(node)) return mapValues(node, walk);
    throw new TypeError("walk: expected a tree node");
  };
  return walk;
}
