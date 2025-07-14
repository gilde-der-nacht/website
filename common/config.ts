import solidJs from "@astrojs/solid-js";
import mdx from "@astrojs/mdx";
import type { AstroUserConfig, RemarkPlugins } from "astro";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkSmartypants from "remark-smartypants";

const remarkSmartyPants = [
  [
    remarkSmartypants,
    {
      openingQuotes: { double: "«", single: "‹" },
      closingQuotes: { double: "»", single: "›" },
    },
  ],
] as RemarkPlugins;

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
    devToolbar: {
      enabled: false,
    },
    markdown: {
      remarkPlugins: [...remarkSmartyPants],
      rehypePlugins: [
        rehypeSlug,
        [
          rehypeAutolinkHeadings,
          { behavior: "wrap", properties: { class: "header-anchor" } },
        ],
      ],
    },
    integrations: [solidJs(), mdx()],
    vite: {
      css: {
        preprocessorOptions: {
          scss: {
            api: "modern-compiler",
          },
        },
      },
    },
  } satisfies AstroUserConfig;
}
