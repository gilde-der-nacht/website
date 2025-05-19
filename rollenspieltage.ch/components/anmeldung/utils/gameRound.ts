import type { PerDay, TimeRange } from "./time";

export const gameTags = [
  {
    name: "children",
    label: "Kinderfreundlich",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    name: "selfmade",
    label: "Mein eigenes System",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
] as const;
export type GameTag = (typeof gameTags)[number]["name"];

export type GameRound = {
  titel: string;
  system: string;
  descriptionShort: string;
  descriptionLong: string;
  slots: PerDay<TimeRange[]>;
  playerCountMin: number;
  playerCountMax: number;
  tags: GameTag[];
};

export function gameRoundDefault(): GameRound {
  return {
    titel: "",
    system: "",
    descriptionShort: "",
    descriptionLong: "",
    slots: {
      SATURDAY: [],
      SUNDAY: [],
    },
    playerCountMin: 3,
    playerCountMax: 6,
    tags: [],
  };
}

export type GameRoundEdit = {
  form: GameRound;
  errors: GameRoundEditErrors;
};

export type GameRoundEditErrors = {
  titleMissing: boolean;
  descriptionShortMissing: boolean;
  descriptionShortTooLong: boolean;
  descriptionLongTooLong: boolean;
  slotMissing: boolean;
};

export function gameRoundEditErrorsDefault(): GameRoundEditErrors {
  return {
    titleMissing: false,
    descriptionShortMissing: false,
    descriptionShortTooLong: false,
    descriptionLongTooLong: false,
    slotMissing: false,
  };
}

export const DESCR_SHORT_MAX_CHAR = 200;
export const DESCR_LONG_MAX_CHAR = 500;
