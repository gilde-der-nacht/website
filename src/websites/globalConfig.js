const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const Image = require("@11ty/eleventy-img");
const { formatJSDate } = require("../themes/crimson/filters/formatDate");
const { md } = require("../themes/crimson/plugins/markdown");
const {
  Form,
  Input,
  Textarea,
  CheckboxList,
  Checkbox,
  RadioList,
  Radio,
  EventList,
  EventFilters,
  NewsletterForm,
  ContactForm,
  Box,
  ButtonLink
} = require("../themes/crimson/shortcodes/shortcodes");

async function setupConfig(config, siteName, themeDir) {
  async function ImageShortcode({ src, alt }) {
    let metadata = await Image(src, {
      widths: [600],
      formats: ["avif", "jpeg"],
      outputDir: "./_site/" + siteName + "/images",
      urlPath: "/images/"
    });
    let imageAttributes = {
      alt,
      sizes: "100vw",
      loading: "lazy",
      decoding: "async",
    };
    return Image.generateHTML(metadata, imageAttributes);
  }

  // compiling SASS files is not done by the SSG
  // but reload the browser, when CSS output changes
  config.ignores.add("**/*.scss");
  config.setBrowserSyncConfig({
    files: "./_site/" + siteName + "/**/*.css",
  });

  config.addLayoutAlias("default", "base.njk");
  config.addPassthroughCopy({ [themeDir + "fonts"]: "fonts" });
  config.addPassthroughCopy({ [themeDir + "icons"]: "icons" });
  config.addPassthroughCopy({ [themeDir + "scripts"]: "scripts" });
  config.addPassthroughCopy({ [themeDir + "images"]: "images" });
  config.addPassthroughCopy("websites/**/*.jpg");
  config.addPassthroughCopy("websites/**/*.png");
  config.addPassthroughCopy("websites/**/*.glb");
  config.addPassthroughCopy({ ["websites/" + siteName + "/public/"]: "/" });

  config.addPlugin(eleventyNavigationPlugin);

  config.addFilter("formatJSDate", formatJSDate);

  config.setLibrary("md", md);

  config.addPairedShortcode("Form", Form);
  config.addPairedShortcode("Box", Box);
  config.addPairedShortcode("CheckboxList", CheckboxList);
  config.addPairedShortcode("RadioList", RadioList);
  config.addShortcode("Input", Input);
  config.addShortcode("Textarea", Textarea);
  config.addShortcode("EventFilters", EventFilters);
  config.addShortcode("EventList", EventList);
  config.addShortcode("NewsletterForm", NewsletterForm);
  config.addShortcode("ContactForm", ContactForm);
  config.addShortcode("ButtonLink", ButtonLink);
  config.addShortcode("Checkbox", Checkbox);
  config.addShortcode("Radio", Radio);
  config.addAsyncShortcode("Image", ImageShortcode);
}

function options(siteName, themeDir) {
  return {
    dir: {
      input: "./websites/" + siteName + "/content",
      output: "./_site/" + siteName,
      includes: "../../../" + themeDir,
      layouts: "../../../" + themeDir + "layouts",
      data: "../data",
    },
    markdownTemplateEngine: "njk",
  };
}

module.exports = { setupConfig, options };
