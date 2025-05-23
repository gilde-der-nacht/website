import { z } from "astro/zod";

const programEntryPublicSchema = z.object({
  uuid: z.string().uuid(),
});
export type ProgramPublicEntry = z.infer<typeof programEntryPublicSchema>;

const programEntryEditSchema = z.object({
  uuid: z.string().uuid(),
});
export type ProgramEditEntry = z.infer<typeof programEntryEditSchema>;

export const programClientSchema = z.object({
  entries: z.array(programEntryPublicSchema),
});
export type ProgramClient = z.infer<typeof programClientSchema>;
