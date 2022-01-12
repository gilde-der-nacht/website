module.exports = function (eleventyConfig) {
    const siteName = "rollenspieltage.ch";
    const themeDir = "/themes/crimson/";

    eleventyConfig.addLayoutAlias('default', 'base.njk');
    eleventyConfig.setBrowserSyncConfig({
        files: "./_site/" + siteName + '**/*.css'
    });

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
