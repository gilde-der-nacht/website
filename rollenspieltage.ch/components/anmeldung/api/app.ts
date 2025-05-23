import { z } from "astro/zod";
import { pageClientSchema } from "@rst/components/anmeldung/api/page";
import { saveClientSchema } from "@rst/components/anmeldung/api/save";
import { publicProgramClientSchema } from "@rst/components/anmeldung/api/program";

const appClientSchema = z.object({
  page: pageClientSchema,
  save: saveClientSchema,
  program: publicProgramClientSchema,
});
export type AppClient = z.infer<typeof appClientSchema>;
