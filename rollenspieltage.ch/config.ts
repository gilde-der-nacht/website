import { defineConfig, squooshImageService } from "astro/config";
import solidJs from "@astrojs/solid-js";

export default defineConfig({
  site: "https://rollenspieltage.ch",
  srcDir: "./rollenspieltage.ch",
  publicDir: "./rollenspieltage.ch/public",
  server: {
    port: 1113
  },
  image: {
    service: squooshImageService()
  },
  devToolbar: {
    enabled: false
  },
  integrations: [solidJs({ devtools: true })]
});
