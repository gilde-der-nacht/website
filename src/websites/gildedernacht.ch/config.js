const { setupConfig, options } = require("../globalConfig");

module.exports = function (eleventyConfig) {
    const siteName = "gildedernacht.ch";
    const themeDir = "/themes/crimson/";

    setupConfig(eleventyConfig, siteName);
    return options(siteName, themeDir);
};
