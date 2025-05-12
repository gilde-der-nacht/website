import {
  loadProgram,
  loadSave,
  type Program,
} from "@rst/components/anmeldung/data";
import type { AppState } from "@rst/components/anmeldung/types";

const PAGES = [
  "CHOOSE",
  "PLAYER",
  "GAMEMASTER",
  "GAMEMASTER_NEW",
  "HELPING",
  "SUMMARY",
] as const;
export type Page = (typeof PAGES)[number];
export const MetaTitle: Record<Page, string> = {
  CHOOSE: "Übersicht",
  PLAYER: "Spielanmeldung",
  GAMEMASTER: "Spielleitung",
  GAMEMASTER_NEW: "Neue Spielrunde",
  HELPING: "Helfen",
  SUMMARY: "Zusammenfassung",
};

export function getPage(url: URL): Page {
  const page = url.searchParams.get("page");
  return PAGES.find((p) => page?.toUpperCase() === p.toUpperCase()) ?? "CHOOSE";
}
export type Params = {
  secret: string | null;
  page: Page;
  showCreateMessage: boolean;
};

export function loadParams(): Params {
  const currentUrl = new URL(location.href);
  const secret = currentUrl.searchParams.get("secret");
  const page = getPage(currentUrl);
  const showCreateMessage =
    currentUrl.searchParams.get("showCreateMessage") === "true";
  return { secret, page, showCreateMessage };
}

export async function loadServerState(params: Params): Promise<AppState> {
  if (params.secret === null) {
    throw Error("SECRET_ERROR");
  }

  const result = await loadSave(params.secret);

  if (result.kind === "FAILED") {
    throw Error("SECRET_ERROR");
  }

  const serverState = {
    state: "IDLE",
    secret: params.secret,
    page: params.page,
    showCreateMessage: params.showCreateMessage,
    gameRoundEdit: {
      titel: "",
      system: "",
      descriptionShort: "",
      descriptionLong: "",
      slot: 1,
      playerCountMin: 3,
      playerCountMax: 6,
      tags: [],
    },
    currentSave: result.save,
    activeTab: "Contact",
    lastSaved: result.save.lastSaved,
    hasChanged: false,
    tentativeReservations: [],
    markedForDeletionReservations: [],
  } satisfies AppState;

  return serverState;
}

export async function loadServerProgram(
  demo: boolean = false,
): Promise<Program> {
  const result = await loadProgram(demo);
  if (result.kind === "FAILED") {
    throw Error("PROGRAM_ERROR");
  }
  return result.program;
}
