import type { WeekendOpeningHours } from "@common/components/Timetable";
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

export const defaultPlainDates = {
  FRIDAY,
  SATURDAY,
  SUNDAY,
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

export const openingHours = {
  FRIDAY: {
    open: { from: 0, to: 0 },
    breaks: [],
  },
  SATURDAY: {
    open: { from: 10, to: 24 },
    breaks: [],
  },
  SUNDAY: {
    open: { from: 10, to: 18 },
    breaks: [],
  },
} satisfies WeekendOpeningHours;
