import { defineConfig, squooshImageService } from "astro/config";

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
});
