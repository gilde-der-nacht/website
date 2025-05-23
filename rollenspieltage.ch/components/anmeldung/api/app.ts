import { z } from "astro/zod";
import { pageClientSchema } from "@rst/components/anmeldung/state/page";
import { saveClientSchema } from "@rst/components/anmeldung/state/save";
import { programClientSchema } from "@rst/components/anmeldung/state/program";

const appClientSchema = z.object({
  page: pageClientSchema,
  save: saveClientSchema,
  program: programClientSchema,
});
export type AppClient = z.infer<typeof appClientSchema>;
