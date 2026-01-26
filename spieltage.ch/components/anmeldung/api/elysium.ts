import { elysium } from "@common/components/utils";

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
