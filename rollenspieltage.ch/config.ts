import { defineAstroConfig } from "../common/config";
import { defineConfig } from "astro/config";

export default defineConfig(
  defineAstroConfig({
    host: "rollenspieltage.ch",
    port: 3333,
  }),
);
