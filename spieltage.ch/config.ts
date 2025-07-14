import { defineAstroConfig } from "../common/config";
import { defineConfig } from "astro/config";

export default defineConfig(
  defineAstroConfig({
    host: "spieltage.ch",
    port: 2222,
  }),
);
