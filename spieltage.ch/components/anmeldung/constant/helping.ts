import type { WeekendOpeningHours } from "@common/components/Timetable";
import type { DateTimeWindow, PerDay, ProgramDay } from "@common/utils/time";

export const helpTypes = {
  kitchen: {
    title: "Küche",
    description:
      "Mahlzeit vorbereiten, unterstützen beim Kochen und Abwaschen.",
  },
  service: {
    title: "Essensausgabe",
    description: "",
  },
  cleaning: {
    title: "Reinigung",
    description: "Unterstützen beim Küche aufräumen und putzen.",
  },
  kiosk: {
    title: "Kiosk",
    description: "Am Kiosk Getränke (inkl. Kaffee) und Snacks verkaufen.",
  },
} as const;

export type HelpType = keyof typeof helpTypes;
export type HelpEntry = {
  uuid: string;
  count: number;
  kind: HelpType;
};
export type HelpTimes = Record<number, HelpEntry[]>;

export type HelpEntryView = {
  dateTime: DateTimeWindow;
  entry: HelpEntry;
};

export const helpTimes = {
  FRIDAY: {},
  SATURDAY: {
    10: [
      {
        uuid: "90178258-734d-4c7d-9df0-891f6d46a5dc",
        count: 1,
        kind: "kiosk",
      },
      {
        uuid: "9ebca7e9-f44a-4cc9-8961-73539f17d5d6",
        count: 1,
        kind: "kitchen",
      },
    ],
    11: [
      { uuid: "690037d9-bd4f-407c-b202-d0dd71d775d2", count: 1, kind: "kiosk" },
      {
        uuid: "804c379d-c747-4d7c-9f0c-a53f8548216e",
        count: 1,
        kind: "kitchen",
      },
    ],
    12: [
      { uuid: "bfec6f59-14eb-45b9-a21c-d33ee2205b64", count: 1, kind: "kiosk" },
      {
        uuid: "97507994-efa1-4e38-9191-3034f77005ad",
        count: 2,
        kind: "kitchen",
      },
    ],
    13: [
      {
        uuid: "8db23dfd-616e-4f1d-9a07-deb6e519d35a",
        count: 2,
        kind: "service",
      },
    ],
    14: [
      { uuid: "a155bb61-d1a6-4f3f-8da3-46eb57030a96", count: 1, kind: "kiosk" },
      {
        uuid: "9faf0a19-45be-4968-9eb0-a9f48e94a616",
        count: 1,
        kind: "cleaning",
      },
    ],
    15: [
      { uuid: "30c6d6ea-3d65-4040-9dde-abb5f4b58e35", count: 1, kind: "kiosk" },
    ],
    16: [
      { uuid: "f70d01f6-cba3-4e3a-be3e-7cdea2cbdb4b", count: 1, kind: "kiosk" },
      {
        uuid: "210e67fe-541e-48bc-a515-d0f5cac12c0b",
        count: 1,
        kind: "kitchen",
      },
    ],
    17: [
      { uuid: "8cdc6efb-d0ff-4a8e-8130-700d2284d2e1", count: 1, kind: "kiosk" },
      {
        uuid: "40ad7820-f4cd-4c8b-914a-203f4cc7b00a",
        count: 2,
        kind: "kitchen",
      },
    ],
    18: [
      {
        uuid: "d4eac28b-130b-4a8e-ad5f-8aee57c2d4d8",
        count: 2,
        kind: "service",
      },
    ],
    19: [
      { uuid: "6fd5ef92-5bb3-4f1a-8673-e81596e53894", count: 1, kind: "kiosk" },
      {
        uuid: "6333be4b-93d9-40c4-8167-dca4f9bb87e1",
        count: 1,
        kind: "cleaning",
      },
    ],
    20: [
      { uuid: "037c19be-79b5-4f94-967d-ffdf9e8c4cd0", count: 1, kind: "kiosk" },
    ],
    21: [
      { uuid: "ce9d82b2-7633-4741-ae58-c96872ffd6bd", count: 1, kind: "kiosk" },
    ],
  },
  SUNDAY: {
    10: [
      { uuid: "ff91d0b8-8bf3-4390-be69-3097d94b7ff0", count: 1, kind: "kiosk" },
    ],
    11: [
      { uuid: "f19c658b-5ad3-4c6a-b344-a2e6756385d9", count: 1, kind: "kiosk" },
      {
        uuid: "ca76897c-844d-4be4-9f5f-8e22e04ee0af",
        count: 1,
        kind: "kitchen",
      },
    ],
    12: [
      { uuid: "21d3be63-10a6-4165-8203-b4d202d78718", count: 1, kind: "kiosk" },
      {
        uuid: "90dfe7c7-1742-4bbf-8f83-cdf6b149af2e",
        count: 2,
        kind: "kitchen",
      },
    ],
    13: [
      {
        uuid: "9d189005-d51b-4fa8-81f1-22e5110fe684",
        count: 2,
        kind: "service",
      },
    ],
    14: [
      { uuid: "01fef159-e93c-4066-9a79-85ba7333dd02", count: 1, kind: "kiosk" },
      {
        uuid: "1196df90-15a5-4c2b-b30e-722c868ebead",
        count: 1,
        kind: "cleaning",
      },
    ],
    15: [
      { uuid: "aef187b1-97f8-4607-844c-79c1404a3796", count: 1, kind: "kiosk" },
    ],
    16: [
      { uuid: "cd1077c1-8fea-42de-a769-32b255f89070", count: 1, kind: "kiosk" },
    ],
    17: [
      { uuid: "1231cecf-7aeb-45e7-b0dc-af8641ecdd94", count: 1, kind: "kiosk" },
    ],
  },
} satisfies PerDay<HelpTimes>;

export function findHelpEntryByUuid(uuid: string | null): HelpEntryView | null {
  const allEntries = helpTimesToHelpEntryView(
    "SATURDAY",
    helpTimes.SATURDAY,
  ).concat(helpTimesToHelpEntryView("SUNDAY", helpTimes.SUNDAY));
  return allEntries.find((entry) => entry.entry.uuid === uuid) ?? null;
}

function helpTimesToHelpEntryView(
  day: ProgramDay,
  perDay: HelpTimes,
): HelpEntryView[] {
  const views: HelpEntryView[] = [];

  Object.entries(perDay).forEach(([hourStr, entries]) => {
    const hour = Number(hourStr);
    entries.forEach((entry) => {
      views.push({
        dateTime: {
          day,
          from: hour,
          to: hour + 1,
        },
        entry,
      });
    });
  });

  return views;
}
export const openingHours = {
  FRIDAY: {
    open: { from: 16, to: 24 },
    breaks: [],
  },
  SATURDAY: {
    open: { from: 9, to: 24 },
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
