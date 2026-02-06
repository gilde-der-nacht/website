import { z } from "astro/zod";

export const serverSchemaDay = z.enum(["FRIDAY", "SATURDAY", "SUNDAY"]);
export type ProgramDay = z.infer<typeof serverSchemaDay>;

export type PerDay<T> = {
  [Day in ProgramDay]: T;
};

const hourRangeSchema = z.object({
  from: z.number(),
  to: z.number(),
});
export type HourRange = z.infer<typeof hourRangeSchema>;

export const dateTimeWindowSchema = hourRangeSchema.extend({
  day: serverSchemaDay,
});

export type DateTimeWindow = z.infer<typeof dateTimeWindowSchema>;

export function isWithin(time: PlainTime, range: PlainTimeDuration): boolean {
  const { startTime, endTime } = range;
  if (startTime.hour > time.hour) {
    return false;
  }
  if (startTime.hour === time.hour && startTime.minute > time.minute) {
    return false;
  }
  if (endTime.hour < time.hour) {
    return false;
  }
  if (endTime.hour === time.hour && endTime.minute < time.minute) {
    return false;
  }

  return true;
}

export function isOverlapping(
  rangeA: PlainTimeDuration,
  rangeB: PlainTimeDuration,
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

// TODO: Migrate to Temporal.PlainDate, when widely available
const plainDateSchema = z.object({
  day: z.number(),
  month: z.number(),
  year: z.number(),
});

export type PlainDate = z.infer<typeof plainDateSchema>;

// TODO: Migrate to Temporal.PlainTime, when widely available
const plainTimeSchema = z.object({
  hour: z.number(),
  minute: z.number(),
});

export type PlainTime = z.infer<typeof plainTimeSchema>;

// TODO: Migrate to Temporal.PlainDateTime, when widely available
const plainDateTimeSchema = z.object({
  day: z.number(),
  month: z.number(),
  year: z.number(),
  hour: z.number(),
  minute: z.number(),
});

export type PlainDateTime = z.infer<typeof plainDateTimeSchema>;

// TODO: Migrate to Temporal.PlainDate, when widely available
const plainDateDurationSchema = z.object({
  startDate: plainDateSchema,
  endDate: plainDateSchema,
});

// TODO: Migrate to Temporal.PlainDate, when widely available
const plainDateTimeDurationSchema = z.object({
  startDate: plainDateTimeSchema,
  endDate: plainDateTimeSchema,
});

export type PlainDateTimeDuration = z.infer<typeof plainDateTimeDurationSchema>;

// TODO: Migrate to Temporal.PlainTime, when widely available
const plainTimeDurationSchema = z.object({
  startTime: plainTimeSchema,
  endTime: plainTimeSchema,
});

export type PlainTimeDuration = z.infer<typeof plainTimeDurationSchema>;

export const plainDateOrTimeDurationSchema = z.union([
  plainDateDurationSchema,
  plainDateTimeDurationSchema,
]);

export type PlainDateOrTimeDuration = z.infer<
  typeof plainDateOrTimeDurationSchema
>;

export function formatTime(
  date: PlainTime,
  opts?: { minutes: boolean },
): string {
  const { minutes } = opts ?? { minutes: true };
  if (minutes) {
    return `${date.hour}.${date.minute.toString().padStart(2, "0")}`;
  }
  return `${date.hour}`;
}

export function formatTimeDuration(from: PlainTime, to: PlainTime): string {
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
  return `${diffHours},${diffMinutes} Stunden`;
}
