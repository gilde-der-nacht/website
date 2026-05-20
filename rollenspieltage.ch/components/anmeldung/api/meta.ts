import { z } from "astro/zod";

const saveStateSchema = z.enum(["SAVING", "IDLE", "ERROR"]);
export type SaveState = z.infer<typeof saveStateSchema>;

export const rolesSchema = z.array(
  z.union([z.literal("admin"), z.literal("erklaerbaer"), z.literal("editor")]),
);
export type Roles = z.infer<typeof rolesSchema>;
