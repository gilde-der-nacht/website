function setupConfig(config, siteName) {
    config.addLayoutAlias('default', 'base.njk');
    config.setBrowserSyncConfig({
        files: "./_site/" + siteName + '/**/*.css'
    });
    config.ignores.add("**/*.scss");
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
