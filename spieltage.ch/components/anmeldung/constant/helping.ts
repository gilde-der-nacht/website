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
  flohmarkt: {
    title: "Flohmarkt",
    description:
      "Hilf uns beim Auf- oder Abbau des Flohmarkt und der Annahme oder Abgabe von Spielen.",
  },
  checkout: {
    title: "Kiosk / Flohmarkt",
    description:
      "Am Kiosk Getränke und Snacks verkaufen oder am Flohmarkt die Kasse bedienen.",
  },
  setup: {
    title: "Aufbau",
    description:
      "Hilf uns beim Zubereiten der Menüs und Aufstellen von Tischen, Stühle und der Bibliothek.",
  },
  breakdown: {
    title: "Abbau",
    description:
      "Hilf uns beim Zusammenräumen von Tischen, Stühle, der Bibliothek und dem Flohmarkt.",
  },
} as const;

export type HelpType = keyof typeof helpTypes;
export type HelpEntry = {
  uuid: `${string}-${string}-${string}-${string}-${string}`;
  count: number;
  duration: number;
  kind: HelpType;
};
export type HelpTimes = Record<number, HelpEntry[]>;

export type HelpEntryView = {
  dateTime: DateTimeWindow;
  entry: HelpEntry;
};

export const helpTimes = {
  FRIDAY: {
    16: [
      {
        uuid: "eb443040-0674-429c-a3ad-48634a323b76",
        count: 4,
        duration: 5,
        kind: "setup",
      },
    ],
    19: [
      {
        uuid: "91699a72-78d0-4dc9-bfe1-ece55b15db7d",
        count: 1,
        duration: 3,
        kind: "flohmarkt",
      },
    ],
  },
  SATURDAY: {
    9: [
      {
        uuid: "6303bd52-cd10-4dd0-b760-b71ab971ad3b",
        count: 4,
        duration: 2,
        kind: "flohmarkt",
      },
    ],
    10: [
      {
        uuid: "9ebca7e9-f44a-4cc9-8961-73539f17d5d6",
        count: 2,
        duration: 2,
        kind: "checkout",
      },
    ],
    11: [
      {
        uuid: "804c379d-c747-4d7c-9f0c-a53f8548216e",
        count: 2,
        duration: 2,
        kind: "checkout",
      },
    ],
    12: [
      {
        uuid: "bfec6f59-14eb-45b9-a21c-d33ee2205b64",
        count: 2,
        duration: 2,
        kind: "checkout",
      },
    ],
    13: [
      {
        uuid: "8db23dfd-616e-4f1d-9a07-deb6e519d35a",
        count: 2,
        duration: 2,
        kind: "checkout",
      },
    ],
    14: [
      {
        uuid: "477a1c27-b660-4221-9be0-de34de910f4b",
        count: 2,
        duration: 2,
        kind: "checkout",
      },
    ],
    15: [
      {
        uuid: "516de07b-bc06-45b5-94f6-be5de186d4d5b",
        count: 2,
        duration: 2,
        kind: "checkout",
      },
    ],
    16: [
      {
        uuid: "490c799f-ced5-461e-a483-ad6a90df221b",
        count: 2,
        duration: 2,
        kind: "checkout",
      },
    ],
    17: [
      {
        uuid: "c9f79536-225a-41ee-93e6-ef1741b511f7",
        count: 2,
        duration: 2,
        kind: "checkout",
      },
    ],
    18: [
      {
        uuid: "c6c3f0f7-04c6-4819-95e6-aa8476e4392c",
        count: 2,
        duration: 2,
        kind: "checkout",
      },
    ],
    19: [
      {
        uuid: "9748b1e6-1712-449b-8dda-eb44f172071e",
        count: 2,
        duration: 2,
        kind: "checkout",
      },
    ],
    20: [
      {
        uuid: "04f724ea-4a78-4363-ba0a-75a71ab22598",
        count: 2,
        duration: 2,
        kind: "checkout",
      },
    ],
    21: [
      {
        uuid: "62d5af53-5e3e-4d59-b574-261e33b0a872",
        count: 2,
        duration: 2,
        kind: "checkout",
      },
    ],
    22: [
      {
        uuid: "98fef052-02ba-4a33-ba2a-13ccad6834c7",
        count: 2,
        duration: 2,
        kind: "checkout",
      },
    ],
    23: [
      {
        uuid: "e4700acc-7192-4063-b03d-cb4009cbe6f2",
        count: 2,
        duration: 1,
        kind: "checkout",
      },
    ],
  },
  SUNDAY: {
    10: [
      {
        uuid: "d30340e1-e49f-44aa-bf1b-d90839b0f1aa",
        count: 2,
        duration: 1,
        kind: "checkout",
      },
      {
        uuid: "e1a9b252-628c-4c01-b8e1-e1964b51e646",
        count: 2,
        duration: 2,
        kind: "checkout",
      },
    ],
    11: [
      {
        uuid: "873a1308-57bc-46bc-bdfc-a82213364c77",
        count: 2,
        duration: 2,
        kind: "checkout",
      },
    ],
    12: [
      {
        uuid: "2e9864a9-0208-4e56-b232-dcd258e31545",
        count: 2,
        duration: 2,
        kind: "checkout",
      },
    ],
    13: [
      {
        uuid: "caef5fea-8458-4b65-b699-9c4e5ee6589d",
        count: 2,
        duration: 2,
        kind: "checkout",
      },
    ],
    14: [
      {
        uuid: "0da24180-0269-4206-adf7-4b9faeefa091",
        count: 2,
        duration: 2,
        kind: "checkout",
      },
    ],
    15: [
      {
        uuid: "6c0430dd-9968-456d-bf68-d893040f73fa",
        count: 2,
        duration: 2,
        kind: "checkout",
      },
    ],
    16: [
      {
        uuid: "40eaef18-d6a0-46e8-b3e5-a98be09cef57",
        count: 2,
        duration: 2,
        kind: "checkout",
      },
    ],
    17: [
      {
        uuid: "3c6468ad-fdb8-432d-92ce-a52fae471206",
        count: 2,
        duration: 1,
        kind: "checkout",
      },
      {
        uuid: "b9da7047-c359-49fa-b558-53207ac5255a",
        count: 2,
        duration: 2,
        kind: "flohmarkt",
      },
      {
        uuid: "c0e1d54c-0832-4147-9054-082208dab2f2",
        count: 4,
        duration: 3,
        kind: "breakdown",
      },
    ],
  },
} satisfies PerDay<HelpTimes>;

const allUUids = [
  ...Object.values(helpTimes.FRIDAY),
  ...Object.values(helpTimes.SATURDAY),
  ...Object.values(helpTimes.SUNDAY),
].flatMap((e) => e.map((ee) => ee.uuid));

const duplicateUuids = Object.entries(Object.groupBy(allUUids, (uuid) => uuid))
  .reduce(
    (acc, [uuid, list]) => {
      return [
        ...acc,
        {
          uuid,
          count: list?.length ?? 0,
        },
      ];
    },
    [] as { uuid: string; count: number }[],
  )
  .filter(({ count }) => {
    return count !== 1;
  });

if (duplicateUuids.length > 0) {
  throw Error(
    `duplicate uuids found:  ${duplicateUuids.map(({ uuid }) => uuid).join(", ")}`,
  );
}

export function findHelpEntryByUuid(uuid: string | null): HelpEntryView | null {
  const allEntries = helpTimesToHelpEntryView("FRIDAY", helpTimes.FRIDAY)
    .concat(helpTimesToHelpEntryView("SATURDAY", helpTimes.SATURDAY))
    .concat(helpTimesToHelpEntryView("SUNDAY", helpTimes.SUNDAY));
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

export const openingHoursHelping = {
  FRIDAY: {
    open: { from: 16, to: 22 },
    breaks: [
      {
        from: 16,
        to: 22,
      },
    ],
  },
  SATURDAY: {
    open: { from: 9, to: 24 },
    breaks: [{ from: 9, to: 10 }],
  },
  SUNDAY: {
    open: { from: 10, to: 20 },
    breaks: [{ from: 18, to: 20 }],
  },
} satisfies WeekendOpeningHours;
