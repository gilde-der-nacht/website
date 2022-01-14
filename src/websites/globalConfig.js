const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");

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
}

function options(siteName, themeDir) {
    return {
        dir: {
            input: "./websites/" + siteName + "/content",
            output: "./_site/" + siteName,
            includes: "../../../" + themeDir,
            layouts: "../../../" + themeDir + "layouts",
            data: "../data"
        }
    }
}

module.exports = { setupConfig, options };
