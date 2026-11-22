import { Temporal } from "@js-temporal/polyfill";
import { z } from "astro/zod";

export const backendSchema = z.object({
  title: z.string(),
  ts: z.instanceof(Temporal.PlainDateTime),
});

export type Backend = z.infer<typeof backendSchema>;
