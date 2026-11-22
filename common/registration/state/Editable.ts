import { z } from "astro/zod";

export const editableSchema = z.object({
  title: z.string(),
  ts: z.string(),
});

export type Editable = z.infer<typeof editableSchema>;
