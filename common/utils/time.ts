import { Temporal } from "@js-temporal/polyfill";
import { z } from "astro/zod";

export const daySchema = z.enum(["FRIDAY", "SATURDAY", "SUNDAY"]);
export type ProgramDay = z.infer<typeof daySchema>;

export type PerDay<T> = {
  [Day in ProgramDay]: T;
};

const hourRangeSchema = z.object({
  from: z.number(),
  to: z.number(),
});
export type HourRange = z.infer<typeof hourRangeSchema>;

export const dateTimeWindowSchema = hourRangeSchema.extend({
  day: daySchema,
});

export type DateTimeWindow = z.infer<typeof dateTimeWindowSchema>;

export function isWithin(
  time: Temporal.PlainTime,
  range: PlainTimeRange,
): boolean {
  const { startTime, endTime } = handleMidnight(range);

  const isAfterStart = Temporal.PlainTime.compare(time, startTime) === 1;

  const isBeforeEnd = Temporal.PlainTime.compare(endTime, time) === 1;

  return isAfterStart && isBeforeEnd;
}

function handleMidnight(range: PlainTimeRange): PlainTimeRange {
  const { startTime, endTime } = range;

  return {
    startTime:
      startTime.hour === 0 && startTime.minute === 0
        ? Temporal.PlainTime.from({ hour: 23, minute: 59 })
        : startTime,
    endTime:
      endTime.hour === 0 && endTime.minute === 0
        ? Temporal.PlainTime.from({ hour: 23, minute: 59 })
        : endTime,
  };
}

export function isOverlapping(
  rangeA: PlainTimeRange,
  rangeB: PlainTimeRange,
): boolean {
  const { startTime: startTimeA, endTime: endTimeA } = rangeA;
  const { startTime: startTimeB, endTime: endTimeB } = rangeB;
  return (
    isWithin(startTimeA, rangeB) ||
    isWithin(endTimeA, rangeB) ||
    isWithin(startTimeB, rangeA) ||
    isWithin(endTimeB, rangeA) ||
    (startTimeA === startTimeB && endTimeA === endTimeB)
  );
}

/**
 * @params `inclusive` can be set to `true` to make the `range.to` inclusive.
 * @returns list of hours starting with `range.from` (inclusive) until `range.to` (exclusive).
 */
export function getHours(
  range: HourRange,
  inclusiveEnd: boolean = false,
): number[] {
  const { from, to } = range;

  if (from > to) {
    return [];
  }

  const length = to - from;
  return toRange(inclusiveEnd ? length + 1 : length, from);
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

export type PlainDateRange = {
  startDate: Temporal.PlainDate;
  endDate: Temporal.PlainDate;
};

export type PlainDateTimeRange = {
  startDate: Temporal.PlainDateTime;
  endDate: Temporal.PlainDateTime;
};

export type PlainTimeRange = {
  startTime: Temporal.PlainTime;
  endTime: Temporal.PlainTime;
};

export type PlainDateOrTimeRange = PlainDateTimeRange | PlainDateRange;

export function formatTime(
  date: Temporal.PlainTime,
  opts?: { minutes: boolean },
): string {
  const { minutes } = opts ?? { minutes: true };
  if (minutes) {
    return `${date.hour}.${date.minute.toString().padStart(2, "0")}`;
  }
  return `${date.hour}`;
}

export function formatTimeDuration(
  from: Temporal.PlainTime,
  to: Temporal.PlainTime,
): string {
  const fromMinutes = from.minute + from.hour * 60;
  const toMinutes = to.minute + to.hour * 60;
  const diff = Math.abs(toMinutes - fromMinutes);
  const diffMinutes = diff % 60;
  const diffHours = Math.round((diff - diffMinutes) / 60);
  if (diffMinutes === 0) {
    return `${diffHours} ${diffHours === 1 ? "Stunde" : "Stunden"}`;
  }
  if (diffHours === 0) {
    return `${diffMinutes} ${diffMinutes === 1 ? "Minute" : "Minuten"}`;
  }
  return `${diffHours} Stunden, ${diffMinutes} Minuten`;
}
