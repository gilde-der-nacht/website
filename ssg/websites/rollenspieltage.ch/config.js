const { setupConfig, options } = require("../globalConfig");

module.exports = function (eleventyConfig) {
    const siteName = "rollenspieltage.ch";
    const themeDir = "themes/crimson/";

    setupConfig(eleventyConfig, siteName, themeDir);
    return options(siteName, themeDir);
};
