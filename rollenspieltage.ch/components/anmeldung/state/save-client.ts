import { z } from "astro/zod";

const playingSchema = z.object({
  wantsUpdates: z.boolean(),
});

const masterSchema = z.object({
  wantsHelp: z.boolean(),
});

const helpingSchema = z.object({});

export const saveSchema = z.object({
  uuid: z.string().uuid(),
  name: z.string(),
  email: z.string(),
  mobile: z.string(),
  lastSaved: z.coerce.date(),
  playing: playingSchema,
  master: masterSchema,
  helping: helpingSchema,
});

export type Save = z.infer<typeof saveSchema>;
