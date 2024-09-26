import { defineAstroConfig } from "../common/config";
import { defineConfig } from "astro/config";

export default defineConfig(
  defineAstroConfig({
    host: "hhh.gildedernacht.ch",
    port: 1112,
  }),
);
