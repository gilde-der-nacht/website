import type { PerDay, TimeRange } from "@rst/components/anmeldung/utils/time";

export type OpeningHours = PerDay<{ open: TimeRange; breaks: TimeRange[] }>;

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
} satisfies OpeningHours;
