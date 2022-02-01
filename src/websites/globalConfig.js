const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
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

const passThroughCopyFormats = ["glb", "blend", "mp4"];

async function setupConfig(config, siteName, themeDir) {
  // compiling SASS files is not done by the SSG
  // but reload the browser, when CSS output changes
  config.ignores.add("**/*.scss");
  config.setBrowserSyncConfig({
    files: "./_site/" + siteName + "/**/*.css",
  });

  config.addPassthroughCopy({ [themeDir + "fonts"]: "fonts" });
  config.addPassthroughCopy({ [themeDir + "icons"]: "icons" });
  config.addPassthroughCopy({ [themeDir + "scripts"]: "scripts" });
  config.addPassthroughCopy({ [themeDir + "images"]: "images" });
  config.addPassthroughCopy({ ["websites/" + siteName + "/public/"]: "/" });
  passThroughCopyFormats.forEach((format) => {
    config.addPassthroughCopy("websites/**/*." + format);
  });

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
