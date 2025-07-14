import { defineConfig } from "astro/config";
import { defineAstroConfig } from "../common/config";

export default defineConfig(
  defineAstroConfig({
    host: "rollenspieltage.ch",
    port: 3333,
  }),
);
