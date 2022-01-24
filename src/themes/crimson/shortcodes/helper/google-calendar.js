const { DateTime } = require("luxon");
var sanitizeHtml = require("sanitize-html");

function removeLineBreaks(str) {
    const trimmed = str.trim();
    if (trimmed.endsWith("<br \/>")) {
        const removedOnce = trimmed.replace(/<br \/>$/, "");
        return removeLineBreaks(removedOnce);
    } else if (trimmed.endsWith("\n")) {
        const removedOnce = trimmed.replace(/\n$/, "");
        return removeLineBreaks(removedOnce);
    }
    return trimmed;
}

function sanitize(str) {
    return removeLineBreaks(
        sanitizeHtml(str, {
            allowedTags: ["br"],
            allowedAttributes: {}
        })
    );
}

function extractTagContent(body, tagName) {
    const re = new RegExp("\\[" + tagName + "\\](?<content>.+?)\\[\\/" + tagName + "\\]");
    const found = re.exec(body);
    return found?.groups?.content;
}

function removeMetaContent(body) {
    const separator = "---";
    const indexOfSeparator = body.indexOf(separator);
    if (indexOfSeparator < 0) {
        return sanitize(body);
    }
    return sanitize(body.substring(0, indexOfSeparator));
}

function parseBody(body) {
    if (!body) {
        return {};
    }
    const tags = extractTagContent(body, "tags");
    const location = extractTagContent(body, "location");
    const theme = extractTagContent(body, "theme");
    const icon = extractTagContent(body, "icon");
    const links = extractTagContent(body, "links");
    const description = removeMetaContent(body);
    return { tags, location, theme, icon, links, description };
}

function cleanUpGoogleEvent({ htmlLink: link, summary: title, description: body, location: loc, start, end }) {
    const startDate = DateTime.fromISO("dateTime" in start ? start.dateTime : start.date);
    const endDate = DateTime.fromISO("dateTime" in end ? end.dateTime : end.date);
    const isFullDay = "date" in start;
    const isMultipleDays = !startDate.hasSame(endDate, "day");
    const parsed = parseBody(body);
    const location = parsed.location || loc;
    const { tags, theme, icon, links, description } = parsed;
    const e = { title, tags, theme, icon, links, description, location, links: { googleCalendar: link }, startDate, endDate, isFullDay, isMultipleDays };
    if (isFullDay) {
        e.endDate = DateTime.fromISO(e.endDate).minus({ seconds: 1 });
    }
    if (!(["discord", "online"].includes(location.toString().toLowerCase()))) {
        e.links.googleMaps = `http://maps.google.com/?q=${location}`;
    }
    return e;
}

module.exports = { cleanUpGoogleEvent };
