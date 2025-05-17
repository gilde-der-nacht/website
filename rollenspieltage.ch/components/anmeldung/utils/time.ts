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
