import { defineConfig, squooshImageService } from "astro/config";
import solidJs from "@astrojs/solid-js";
import mdx from "@astrojs/mdx";

export default defineConfig({
  site: "https://rollenspieltage.ch",
  srcDir: "./rollenspieltage.ch",
  publicDir: "./rollenspieltage.ch/public",
  outDir: "./dist/rollenspieltage.ch",
  server: {
    port: 1113
  },
  image: {
    service: squooshImageService()
  },
  devToolbar: {
    enabled: false
  },
  integrations: [
    solidJs(),
    mdx()
  ]
});
