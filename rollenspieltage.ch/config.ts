import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://rollenspieltage.ch",
  srcDir: "./rollenspieltage.ch",
  server: {
    port: 1113
  },
  devToolbar: {
    enabled: false
  }
});
