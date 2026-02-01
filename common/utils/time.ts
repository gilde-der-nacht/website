import { z } from "astro/zod";

export const serverSchemaDay = z.enum(["FRIDAY", "SATURDAY", "SUNDAY"]);
export type ProgramDay = z.infer<typeof serverSchemaDay>;

export type PerDay<T> = {
  [Day in ProgramDay]: T;
};

const timeRangeSchema = z.object({
  from: z.number(),
  to: z.number(),
});
export type TimeRange = z.infer<typeof timeRangeSchema>;

export const dateTimeWindowSchema = timeRangeSchema.extend({
  day: serverSchemaDay,
});

export type DateTimeWindow = z.infer<typeof dateTimeWindowSchema>;

export function isWithin(num: number, range: TimeRange): boolean {
  const { from, to } = range;
  return from < num && num < to;
}

export function isOverlapping(rangeA: TimeRange, rangeB: TimeRange): boolean {
  const { from: fromA, to: toA } = rangeA;
  const { from: fromB, to: toB } = rangeB;
  return (
    isWithin(fromA, rangeB) ||
    isWithin(toA, rangeB) ||
    isWithin(fromB, rangeA) ||
    isWithin(toB, rangeA) ||
    (fromA === fromB && toA === toB)
  );
}

/**
 * @params `inclusive` can be set to `true` to make the `range.to` inclusive.
 * @returns list of hours starting with `range.from` (inclusive) until `range.to` (exclusive).
 */
export function getHours(
  range: TimeRange,
  inclusiveeEnd: boolean = false,
): number[] {
  const { from, to } = range;

  if (from > to) {
    return [];
  }

  const length = to - from;
  return toRange(inclusiveeEnd ? length + 1 : length, from);
}

export function toRange(length: number, offset: number = 0): number[] {
  return [...Array(length)].map((_, i) => i + offset);
}

export function sortByDateTimeWindow(
  a: DateTimeWindow | null,
  b: DateTimeWindow | null,
): number {
  if (a === null) {
    return -1;
  }
  if (b === null) {
    return 1;
  }
  if (a.day === "SATURDAY" && b.day === "SUNDAY") {
    return -1;
  }
  if (a.day === "SUNDAY" && b.day === "SATURDAY") {
    return 1;
  }
  if (a.from === b.from) {
    return a.to - b.to;
  }
  return a.from - b.from;
}
