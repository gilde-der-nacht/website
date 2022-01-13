function setupConfig(config, siteName) {
    // compiling SASS files is not done by the SSG
    // but reload the browser, when CSS output changes
    config.ignores.add("**/*.scss");
    config.setBrowserSyncConfig({
        files: "./_site/" + siteName + '/**/*.css'
    });

    config.addLayoutAlias('default', 'base.njk');
    config.addPassthroughCopy({ "themes/**/*.woff2": "fonts" });
}

function options(siteName, themeDir) {
    return {
        dir: {
            input: "./websites/" + siteName + "/content",
            output: "./_site/" + siteName,
            includes: "../../.." + themeDir,
            layouts: "../../.." + themeDir + "layouts",
            data: "../data"
        }
    }
}

module.exports = { setupConfig, options };
