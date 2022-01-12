module.exports = function (eleventyConfig) {
    return {
        dir: {
            input: "websites/gildedernacht.ch/content",
            output: "_site/gdn/",
            includes: "../../../themes/crimson/",
            layouts: "../../../themes/crimson/layouts",
            data: "../data"
        }
    }
};
