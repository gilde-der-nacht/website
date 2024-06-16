import { defineConfig, squooshImageService } from "astro/config";
import solidJs from "@astrojs/solid-js";
import mdx from "@astrojs/mdx";

export default defineConfig({
  site: "https://gildedernacht.ch",
  srcDir: "./gildedernacht.ch",
  publicDir: "./gildedernacht.ch/public",
  outDir: "./dist/gildedernacht.ch",
  server: {
    port: 1111
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
