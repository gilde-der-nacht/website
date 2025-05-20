import type { GameMasterRoundNew } from "../data";

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

export function gameRoundDefault(): GameMasterRoundNew {
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
