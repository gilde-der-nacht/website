import { defineConfig, squooshImageService } from "astro/config";
import solidJs from "@astrojs/solid-js";
import mdx from "@astrojs/mdx";

export default defineConfig({
  site: "https://spieltage.ch",
  srcDir: "./spieltage.ch",
  publicDir: "./spieltage.ch/public",
  outDir: "./dist/spieltage.ch",
  server: {
    port: 1112
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
