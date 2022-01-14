function setupConfig(config, siteName, themeDir) {
    // compiling SASS files is not done by the SSG
    // but reload the browser, when CSS output changes
    config.ignores.add("**/*.scss");
    config.setBrowserSyncConfig({
        files: "./_site/" + siteName + '/**/*.css'
    });

    config.addLayoutAlias('default', 'base.njk');
    config.addPassthroughCopy({ [themeDir + "**/*.woff2"]: "fonts" });
    config.addPassthroughCopy({ [themeDir + "**/*.js"]: "scripts" });
    config.addPassthroughCopy({ [themeDir + "**/*.svg"]: "images" });
    config.addPassthroughCopy("websites/**/*.jpg");
    config.addPassthroughCopy("websites/**/*.png");
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
