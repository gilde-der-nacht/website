import { defineConfig } from "astro/config";
import { defineAstroConfig } from "../common/config";

export default defineConfig(
  defineAstroConfig({
    host: "spieltage.ch",
    port: 2222,
  }),
);
