import { defineConfig } from "astro/config";
import { defineAstroConfig } from "../common/config";

export default defineConfig(
  defineAstroConfig({
    host: "gildedernacht.ch",
    port: 1111,
  }),
);
