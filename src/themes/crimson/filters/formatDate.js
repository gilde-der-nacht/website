const { DateTime } = require("luxon");

module.exports = function (dateString) {
    return DateTime.fromJSDate(new Date(dateString)).toFormat("d.L.yyyy");
}
