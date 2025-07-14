import { defineConfig } from "astro/config";
import { defineAstroConfig } from "../common/config";

export default defineConfig(
  defineAstroConfig({
    host: "hhh.gildedernacht.ch",
    port: 1112,
  }),
);
