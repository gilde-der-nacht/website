const { setupConfig, options } = require("../globalConfig");

module.exports = function (eleventyConfig) {
    const siteName = "spieltage.ch";
    const themeDir = "/themes/crimson/";

    setupConfig(eleventyConfig, siteName);
    return options(siteName, themeDir);
};