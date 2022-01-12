module.exports = function (eleventyConfig) {
    const siteName = "gildedernacht.ch";
    const themeDir = "/themes/crimson/";

    eleventyConfig.addLayoutAlias('default', 'base.njk');
    eleventyConfig.setBrowserSyncConfig({
        files: "./_site/" + siteName + '/**/*.css'
    });
    eleventyConfig.ignores.add("**/*.scss");
    eleventyConfig.addPassthroughCopy({ "themes/**/*.woff2": "fonts" });

    return {
        dir: {
            input: "./websites/" + siteName + "/content",
            output: "./_site/" + siteName,
            includes: "../../.." + themeDir,
            layouts: "../../.." + themeDir + "layouts",
            data: "../data"
        }
    }
};
