const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const { formatJSDate } = require("../themes/crimson/filters/formatDate");
const markdownLib = require("../themes/crimson/plugins/markdown");
const {
  Form,
  Input,
  Textarea,
  EventList,
  EventFilters,
  NewsletterForm
} = require("../themes/crimson/shortcodes/shortcodes");

function setupConfig(config, siteName, themeDir) {
  // compiling SASS files is not done by the SSG
  // but reload the browser, when CSS output changes
  config.ignores.add("**/*.scss");
  config.setBrowserSyncConfig({
    files: "./_site/" + siteName + "/**/*.css",
  });

  config.addLayoutAlias("default", "base.njk");
  config.addPassthroughCopy({ [themeDir + "fonts"]: "fonts" });
  config.addPassthroughCopy({ [themeDir + "scripts"]: "scripts" });
  config.addPassthroughCopy({ [themeDir + "images"]: "images" });
  config.addPassthroughCopy("websites/**/*.jpg");
  config.addPassthroughCopy("websites/**/*.png");
  config.addPassthroughCopy("websites/**/*.glb");
  config.addPassthroughCopy({ ["websites/" + siteName + "/public/"]: "/" });

  config.addPlugin(eleventyNavigationPlugin);

  config.addFilter("formatJSDate", formatJSDate);

  config.setLibrary("md", markdownLib);

  config.addPairedShortcode("Form", Form);
  config.addShortcode("Input", Input);
  config.addShortcode("Textarea", Textarea);
  config.addShortcode("EventFilters", EventFilters);
  config.addShortcode("EventList", EventList);
  config.addShortcode("NewsletterForm", NewsletterForm);
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
