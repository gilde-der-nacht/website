const { formatJSDate } = require("../../../../themes/crimson/filters/formatDate");

const isDevEnv = process.env.ELEVENTY_ENV === 'development';
function isDraft(data) { return 'draft' in data && data.draft !== false; }
function isFutureDate(data) { return 'date' in data ? data.date > todaysDate : data.page.date > todaysDate; }
const todaysDate = new Date();
function showDraft(data) {
    return isDevEnv || (!isDraft(data) && !isFutureDate(data));
}
function formattedDate(data) {
    if ("date" in data) {
        return formatJSDate(data.date);
    } else {
        return formatJSDate(data.page.date);
    }
}

module.exports = function () {
    return {
        tags: "article",
        layout: "default",
        eleventyComputed: {
            eleventyExcludeFromCollections: function (data) {
                if (showDraft(data)) {
                    return data.eleventyExcludeFromCollections;
                }
                else {
                    return true;
                }
            },
            permalink: function (data) {
                if (showDraft(data)) {
                    return "artikel/" + data.page.fileSlug + "/index.html";
                }
                else {
                    return false;
                }
            },
            isDraft,
            isFutureDate,
            formattedDate
        }
    }
}
