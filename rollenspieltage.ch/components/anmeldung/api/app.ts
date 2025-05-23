import { z } from "astro/zod";
import { metaClientSchema } from "@rst/components/anmeldung/api/meta";
import { saveClientSchema } from "@rst/components/anmeldung/api/save";
import { publicProgramClientSchema } from "@rst/components/anmeldung/api/program";

const appClientSchema = z.object({
  meta: metaClientSchema,
  save: saveClientSchema,
  program: publicProgramClientSchema,
});
export type AppClient = z.infer<typeof appClientSchema>;
