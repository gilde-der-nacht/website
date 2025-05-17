import type {
  PerDay,
  ProgramDay,
  ProgramEntry,
  ReservedEntry,
  SaveFromServer,
} from "./data";
import type { TimeRange } from "./types";

const VERSION = 1;
const SAVE_KEY = "SAVE";
const PROGRAM_KEY = "PROGRAM";

const DEMO_SAVE: SaveFromServer = {
  registrationId: -1,
  name: "Demo",
  email: "demo@mail.com",
  handynummer: "+41 12 123 12 12",
  wantsEmailUpdates: true,
  games: [],
  lastSaved: "2024-08-15T07:45:21.335Z",
};

export function getDemoSave(): SaveFromServer {
  const localSave = localStorage.getItem(SAVE_KEY);
  let currentSave: { version: number; data: SaveFromServer };

  if (localSave === null) {
    currentSave = {
      version: VERSION,
      data: DEMO_SAVE,
    };
  } else {
    currentSave = JSON.parse(localSave) as {
      version: number;
      data: SaveFromServer;
    };
  }

  if (currentSave.version !== VERSION) {
    console.error(
      "Your local storage data was outdated and has been replaced with new demo content.",
    );
    currentSave = {
      version: VERSION,
      data: DEMO_SAVE,
    };
  }

  localStorage.setItem(SAVE_KEY, JSON.stringify(currentSave));
  return currentSave.data;
}

export type DateTimeWindow = { day: ProgramDay } & TimeRange;
export type OpeningHours = PerDay<{ open: TimeRange; breaks: TimeRange[] }>;

export type Program = {
  gameList: ProgramEntry[];
  reservedList: ReservedEntry[];
  openingHours: OpeningHours;
};

const DEMO_PROGRAM: Program = {
  gameList: [],
  reservedList: [],
  openingHours: {
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
  },
};

export function getDemoProgram(): Program {
  const localSave = localStorage.getItem(PROGRAM_KEY);
  let currentSave: { version: number; data: Program };

  if (localSave === null) {
    currentSave = {
      version: VERSION,
      data: DEMO_PROGRAM,
    };
  } else {
    currentSave = JSON.parse(localSave) as {
      version: number;
      data: Program;
    };
  }

  if (currentSave.version !== VERSION) {
    console.error(
      "Your local storage data was outdated and has been replaced with new demo content.",
    );
    currentSave = {
      version: VERSION,
      data: DEMO_PROGRAM,
    };
  }

  localStorage.setItem(PROGRAM_KEY, JSON.stringify(currentSave));
  return currentSave.data;
}
