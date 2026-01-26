import { elysium } from "@common/components/utils";
import type { Save } from "@lst/components/anmeldung/api/save";

export type Result<T> =
  | {
      kind: "SUCCESS";
      data: T;
    }
  | {
      kind: "FAILURE";
    };

export async function elysiumLoadSave(
  secret: string,
): Promise<Result<unknown>> {
  const url = new URL(elysium("/lst26/load"));
  url.searchParams.append("secret", secret);

  const response = await fetch(url);
  if (!response.ok) {
    return { kind: "FAILURE" };
  }
  const data = (await response.json()) as unknown;
  if (typeof data === "object" && data !== null) {
    return { kind: "SUCCESS", data };
  }
  console.error("`last_save` not found on ", data);
  return { kind: "FAILURE" };
}

export async function elysiumSaveState(
  save: Save,
  secret: string,
): Promise<Result<string>> {
  try {
    const result = await fetch(elysium("/lst26/save"), {
      method: "POST",
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
