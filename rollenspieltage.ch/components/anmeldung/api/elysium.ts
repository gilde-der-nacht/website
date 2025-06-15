import { elysium } from "@common/components/utils";
import type { Result } from "./utils";
import type { SaveServer } from "./save";

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
  if (typeof data === "object" && data !== null && "last_save" in data) {
    return { kind: "SUCCESS", data: data.last_save };
  }
  console.error("`last_save` not found on ", data);
  return { kind: "FAILURE" };
}

export async function elysiumSaveState(
  state: SaveServer,
  secret: string,
): Promise<Result<string>> {
  try {
    const result = await fetch(elysium("/rst25/save"), {
      method: "post",
      body: JSON.stringify(state),
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
