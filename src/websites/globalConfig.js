const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const { TableContainer, Form, Input, Textarea } = require("../themes/crimson/shortcodes/shortcodes");

function setupConfig(config, siteName, themeDir) {
    // compiling SASS files is not done by the SSG
    // but reload the browser, when CSS output changes
    config.ignores.add("**/*.scss");
    config.setBrowserSyncConfig({
        files: "./_site/" + siteName + '/**/*.css'
    });

    config.addLayoutAlias('default', 'base.njk');
    config.addPassthroughCopy({ [themeDir + "fonts"]: "fonts" });
    config.addPassthroughCopy({ [themeDir + "scripts"]: "scripts" });
    config.addPassthroughCopy({ [themeDir + "images"]: "images" });
    config.addPassthroughCopy("websites/**/*.jpg");
    config.addPassthroughCopy("websites/**/*.png");

    config.addPlugin(eleventyNavigationPlugin);

    config.addPairedShortcode("tablecontainer", TableContainer);
    config.addPairedShortcode("form", Form);
    config.addShortcode("input", Input);
    config.addShortcode("textarea", Textarea);
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
