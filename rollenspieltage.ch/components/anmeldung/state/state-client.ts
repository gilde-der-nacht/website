import { z } from "astro/zod";
import { pageStateSchema } from "@rst/components/anmeldung/state/page-client";

const meineAnmeldungStateSchema = z.object({
  page: pageStateSchema,
});
export type MeineAnmeldungState = z.infer<typeof meineAnmeldungStateSchema>;
