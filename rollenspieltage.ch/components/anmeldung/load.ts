import {
  loadProgram,
  loadSave,
  type Program,
} from "@rst/components/anmeldung/data";
import type { AppState } from "@rst/components/anmeldung/types";
import { gameRoundDefault } from "./utils/gameRound";

export type PageMeta =
  | ["CHOOSE"]
  | ["PLAYER"]
  | ["GAMEMASTER"]
  | ["GAMEMASTER_NEW"]
  | ["GAMEMASTER_EDIT", string]
  | ["HELPING"]
  | ["SUMMARY"];

export type Page = PageMeta[0];

export const MetaTitle: Record<Page, string> = {
  CHOOSE: "Übersicht",
  PLAYER: "Spielanmeldung",
  GAMEMASTER: "Spielleitung",
  GAMEMASTER_NEW: "Neue Spielrunde",
  GAMEMASTER_EDIT: "Spielrunde editieren",
  HELPING: "Helfen",
  SUMMARY: "Zusammenfassung",
};

const PAGES = [
  "CHOOSE",
  "PLAYER",
  "GAMEMASTER",
  "GAMEMASTER_NEW",
  "GAMEMASTER_EDIT",
  "HELPING",
  "SUMMARY",
] satisfies Page[];

export function getPageMeta(url: URL): PageMeta {
  const pageParam = url.searchParams.get("page");
  const page =
    PAGES.find((p) => pageParam?.toUpperCase() === p.toUpperCase()) ?? "CHOOSE";
  if (page === "GAMEMASTER_EDIT") {
    const uuid = url.searchParams.get("uuid");
    if (uuid !== null) {
      return [page, uuid];
    }
    return ["GAMEMASTER"];
  }

  return [page];
}
export type Params = {
  secret: string | null;
  pageMeta: PageMeta;
  showCreateMessage: boolean;
};

export function loadParams(): Params {
  const currentUrl = new URL(location.href);
  const secret = currentUrl.searchParams.get("secret");
  const pageMeta = getPageMeta(currentUrl);
  const showCreateMessage =
    currentUrl.searchParams.get("showCreateMessage") === "true";
  return { secret, pageMeta, showCreateMessage };
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
    pageMeta: params.pageMeta,
    showCreateMessage: params.showCreateMessage,
    gameRoundEdit: {
      form: gameRoundDefault(),
      errors: gameRoundEditErrorsDefault(),
    },
    currentSave: result.save,

    // old state
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
