import {
  loadProgram,
  loadSave,
  type Program,
} from "@rst/components/anmeldung/data";
import type { Store } from "@rst/components/anmeldung/types";

type Params = {
  secret: string | null;
  showCreateMessage: boolean;
};

export function loadParams(): Params {
  const currentUrl = new URL(location.href);
  const secret = currentUrl.searchParams.get("secret");
  const showCreateMessage =
    currentUrl.searchParams.get("showCreateMessage") === "true";
  return { secret, showCreateMessage };
}

export async function loadServerState(params: Params): Promise<Store> {
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
    showCreateMessage: params.showCreateMessage,
    currentSave: result.save,
    activeTab: "Contact",
    lastSaved: result.save.lastSaved,
    hasChanged: false,
    tentativeReservations: [],
    markedForDeletionReservations: [],
  } satisfies Store;

  return serverState;
}

export async function loadServerProgram(): Promise<Program> {
  const result = await loadProgram();
  if (result.kind === "FAILED") {
    throw Error("PROGRAM_ERROR");
  }
  return result.program;
}
