const { DateTime } = require("luxon");

function formatJSDate(dateString) {
    return DateTime.fromJSDate(dateString).setLocale("de").toLocaleString(DateTime.DATE_FULL);
}

function formatISODate(dateString) {
    return DateTime.fromISO(dateString).setLocale("de").toLocaleString(DateTime.DATE_FULL);
}

function formatISODateTime(dateString) {
    return DateTime.fromISO(dateString).setLocale("de").setZone("CET").toLocaleString(DateTime.DATETIME_MED);
}

module.exports = { formatJSDate, formatISODate, formatISODateTime };
