import { elysiumLoadSave } from "@lst/components/anmeldung/api/elysium";
import { z } from "astro/zod";

const loadSaveSchema = z.object({
  kind: z.literal("SUCCESS"),
  data: z.object({
    version: z.literal(2),
    contact: z.object({
      name: z.string(),
      email: z.string(),
      mobile: z.string(),
    }),
  }),
});

type LoadSave = z.infer<typeof loadSaveSchema>;

type LoadSaveResult =
  | {
      kind: "SUCCESS";
      data: LoadSave;
    }
  | {
      kind: "FAILURE";
      reason: "SECRET_INVALID" | "PARSE_ERROR" | "GENERAL";
    };

export async function loadSave(secret: string): Promise<LoadSaveResult> {
  if (secret.length !== 36 && secret.length !== "demo".length) {
    return { kind: "FAILURE", reason: "SECRET_INVALID" };
  }

  const save = await elysiumLoadSave(secret);

  if (save.kind === "FAILURE") {
    console.error("Unexpected error. Maybe network, maybe server error.");
    return {
      kind: "FAILURE",
      reason: "GENERAL",
    };
  }
  const parseResult = loadSaveSchema.safeParse(save);

  if (!parseResult.success) {
    console.error(parseResult.error);
    return {
      kind: "FAILURE",
      reason: "PARSE_ERROR",
    };
  }

  return {
    kind: "SUCCESS",
    data: parseResult.data,
  };
}
