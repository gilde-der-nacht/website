import { elysium } from "@common/components/utils";
import type { Result } from "./utils";
import type { SaveServer } from "./save";

const initState = {
  version: 1,
  init: {
    name: "",
    email: "",
    mobile: "",
  },
  lastSaved: new Date().toISOString(),
  playing: {
    wantsUpdates: true,
    reservations: [],
  },
  master: {
    games: [],
    wantsHelp: false,
  },
  helping: {},
} satisfies SaveServer;

export async function elysiumLoadSave(
  secret: string,
): Promise<Result<unknown>> {
  const url = new URL(elysium("/rst25/load"));
  url.searchParams.append("secret", secret);
  const response = await fetch(url);
  if (!response.ok) {
    return { kind: "FAILURE" };
  }
  const data = (await response.json()) as unknown;
  if (typeof data === "object" && data !== null) {
    const d = Object.assign(initState, data);
    return { kind: "SUCCESS", data: d };
  }
  console.error("`last_save` not found on ", data);
  return { kind: "FAILURE" };
}

export async function elysiumSaveState(
  save: SaveServer,
  secret: string,
): Promise<Result<string>> {
  try {
    const result = await fetch(elysium("/rst25/save"), {
      method: "post",
      body: JSON.stringify({ secret, save }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!result.ok) {
      console.error(await result.text());
      return { kind: "FAILURE" };
    }
    return { kind: "SUCCESS", data: secret };
  } catch (e) {
    console.error(e);
    return { kind: "FAILURE" };
  }
}

export async function elysiumLoadProgram(): Promise<Result<unknown>> {
  try {
    const result = await fetch(elysium("/rst25/program"), {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!result.ok) {
      console.error(await result.text());
      return { kind: "FAILURE" };
    }
    const data = (await result.json()) as unknown;

    return { kind: "SUCCESS", data };
  } catch (e) {
    console.error(e);
    return { kind: "FAILURE" };
  }
}

export async function elysiumLoadReservations(
  secret: string,
  uuids: string[],
): Promise<Result<unknown>> {
  try {
    const result = await fetch(elysium("/rst25/registrations"), {
      method: "post",
      body: JSON.stringify({ secret, uuids }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!result.ok) {
      console.error(await result.text());
      return { kind: "FAILURE" };
    }
    const data = (await result.json()) as unknown;

    return { kind: "SUCCESS", data };
  } catch (e) {
    console.error(e);
    return { kind: "FAILURE" };
  }
}
