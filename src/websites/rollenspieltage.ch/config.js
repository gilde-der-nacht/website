module.exports = function (eleventyConfig) {
    return {
        dir: {
            input: "websites/rollenspieltage.ch/content",
            output: "_site/rst/",
            includes: "../../../themes/crimson/",
            layouts: "../../../themes/crimson/layouts",
            data: "../data"
        }
    }
};
