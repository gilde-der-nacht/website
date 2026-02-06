import type { PlainDate, PlainDateTime, ProgramDay } from "@common/utils/time";

export const FRIDAY: PlainDate = {
  year: 2026,
  month: 3,
  day: 13,
};

export const SATURDAY: PlainDate = {
  year: 2026,
  month: 3,
  day: 14,
};

export const SUNDAY: PlainDate = {
  year: 2026,
  month: 3,
  day: 15,
};

export function getDay(date: PlainDate | PlainDateTime): ProgramDay | null {
  const { year, month, day } = date;
  if (FRIDAY.year === year && FRIDAY.month === month && FRIDAY.day === day) {
    return "FRIDAY";
  }
  if (
    SATURDAY.year === year &&
    SATURDAY.month === month &&
    SATURDAY.day === day
  ) {
    return "SATURDAY";
  }
  if (SUNDAY.year === year && SUNDAY.month === month && SUNDAY.day === day) {
    return "SUNDAY";
  }
  return null;
}
