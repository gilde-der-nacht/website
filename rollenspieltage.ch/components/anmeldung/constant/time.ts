import type { WeekendOpeningHours } from "@common/components/Timetable";
import type { ProgramDay } from "@common/utils/time";
import { Temporal } from "@js-temporal/polyfill";

export const FRIDAY = Temporal.PlainDate.from({
  year: 2026,
  month: 8,
  day: 21,
});

export const SATURDAY = Temporal.PlainDate.from({
  year: 2026,
  month: 8,
  day: 22,
});

export const SUNDAY = Temporal.PlainDate.from({
  year: 2026,
  month: 8,
  day: 23,
});

export const defaultPlainDates = {
  FRIDAY,
  SATURDAY,
  SUNDAY,
};

export function getDay(
  date: Temporal.PlainDate | Temporal.PlainDateTime | string,
): ProgramDay | null {
  const { year, month, day } =
    typeof date === "string" ? Temporal.PlainDate.from(date) : date;
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
    breaks: [
      {
        from: 13,
        to: 14,
      },
      {
        from: 18,
        to: 19,
      },
    ],
  },
  SUNDAY: {
    open: { from: 10, to: 18 },
    breaks: [
      {
        from: 13,
        to: 14,
      },
    ],
  },
} satisfies WeekendOpeningHours;
