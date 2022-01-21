const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const formatDate = require("../themes/crimson/filters/formatDate");
const markdownLib = require("../themes/crimson/plugins/markdown");
const { TableContainer, Form, Input, Textarea } = require("../themes/crimson/shortcodes/shortcodes");

function setupConfig(config, siteName, themeDir) {
    // compiling SASS files is not done by the SSG
    // but reload the browser, when CSS output changes
    config.ignores.add("**/*.scss");
    config.setBrowserSyncConfig({
        files: "./_site/" + siteName + "/**/*.css"
    });

    config.addLayoutAlias("default", "base.njk");
    config.addPassthroughCopy({ [themeDir + "fonts"]: "fonts" });
    config.addPassthroughCopy({ [themeDir + "scripts"]: "scripts" });
    config.addPassthroughCopy({ [themeDir + "images"]: "images" });
    config.addPassthroughCopy("websites/**/*.jpg");
    config.addPassthroughCopy("websites/**/*.png");

    config.addPlugin(eleventyNavigationPlugin);

    config.setLibrary("md", markdownLib);

    config.addPairedShortcode("tablecontainer", TableContainer);
    config.addPairedShortcode("form", Form);
    config.addShortcode("input", Input);
    config.addShortcode("textarea", Textarea);

    config.addFilter("formatDate", formatDate);
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
        markdownTemplateEngine: "njk"
    }
}

module.exports = { setupConfig, options };
