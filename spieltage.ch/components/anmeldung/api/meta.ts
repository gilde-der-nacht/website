import { z } from "astro/zod";

const saveStateSchema = z.enum(["SAVING", "IDLE", "ERROR"]);
export type SaveState = z.infer<typeof saveStateSchema>;
