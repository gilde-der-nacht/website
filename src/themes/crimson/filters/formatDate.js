const { DateTime } = require("luxon");

module.exports = function (dateString) {
    return DateTime.fromJSDate(dateString).setLocale("de").toLocaleString(DateTime.DATE_FULL);
}
