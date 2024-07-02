import { squooshImageService } from "astro/config";
import solidJs from "@astrojs/solid-js";
import mdx from "@astrojs/mdx";
import type { AstroUserConfig } from "astro";

type ConfigProps = {
  host: string;
  port: number;
};

export function defineAstroConfig(props: ConfigProps): AstroUserConfig {
  return {
    site: `https://${props.host}`,
    srcDir: `./${props.host}`,
    publicDir: `./${props.host}/public`,
    outDir: `./dist/${props.host}`,
    server: {
      port: props.port,
    },
    image: {
      service: squooshImageService(),
    },
    devToolbar: {
      enabled: false,
    },
    integrations: [solidJs(), mdx()],
  } satisfies AstroUserConfig;
}
