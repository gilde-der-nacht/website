import { squooshImageService } from "astro/config";
import solidJs from "@astrojs/solid-js";
import mdx from "@astrojs/mdx";
import type { AstroUserConfig } from "astro";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";

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
    markdown: {
      rehypePlugins: [
        rehypeSlug,
        [
          rehypeAutolinkHeadings,
          { behavior: "wrap", properties: { class: "header-anchor" } },
        ],
      ],
    },
    integrations: [solidJs(), mdx()],
  } satisfies AstroUserConfig;
}
