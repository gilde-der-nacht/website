import { z } from "astro/zod";

export const serverSchemaDay = z.enum(["SATURDAY", "SUNDAY"]);
export type ProgramDay = z.infer<typeof serverSchemaDay>;

export type PerDay<T> = {
  [Day in ProgramDay]: T;
};
export type TimeRange = {
  from: number;
  to: number;
};

export type DateTimeWindow = { day: ProgramDay } & TimeRange;

export function isWithin(num: number, range: TimeRange): boolean {
  const { from, to } = range;
  return from <= num && num <= to;
}

export function isOverlapping(rangeA: TimeRange, rangeB: TimeRange): boolean {
  const { from: fromA, to: toA } = rangeA;
  const { from: fromB, to: toB } = rangeB;
  return (
    isWithin(fromA, rangeB) ||
    isWithin(toA, rangeB) ||
    isWithin(fromB, rangeA) ||
    isWithin(toB, rangeA)
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
  return [...Array(inclusiveeEnd ? length + 1 : length)].map(
    (_, i) => i + from,
  );
}
