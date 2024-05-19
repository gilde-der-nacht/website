import { defineConfig } from "astro/config";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  site: "https://rollenspieltage.ch",
  srcDir: "./rollenspieltage.ch",
  publicDir: "./rollenspieltage.ch/public",
  server: {
    port: 1113
  },
  devToolbar: {
    enabled: false
  },
  vite: {
    plugins: [viteStaticCopy({
      targets: [
        {
          src: "./common/fonts/*",
          dest: "./fonts/"
        },
        {
          src: "./common/images/*",
          dest: "./images/"
        },
        {
          src: "./common/icons/*",
          dest: "./icons/"
        }
      ]
    })]
  }
});
