import { defineAstroConfig } from "../common/config";
import { defineConfig } from "astro/config";

export default defineConfig(
  defineAstroConfig({
    host: "gildedernacht.ch",
    port: 1111,
  }),
);
