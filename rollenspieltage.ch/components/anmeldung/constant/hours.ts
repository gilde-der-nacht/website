import type {
  PerDay,
  ProgramDay,
  TimeRange,
} from "@rst/components/anmeldung/utils/time";

export type WeekendOpeningHours = PerDay<{
  open: TimeRange;
  breaks: TimeRange[];
}>;
export type OpeningHours = WeekendOpeningHours[ProgramDay];

export const openingHours = {
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
