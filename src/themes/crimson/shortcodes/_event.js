const { DateTime } = require("luxon");
const { md } = require("../plugins/markdown");
const { formatISODate, formatISODateTime } = require("../filters/formatDate");
const html = require("./helper/html");
const { cleanUpGoogleEvent, getListOfTags } = require("./helper/google-calendar");

function EventEntry(event) {
    function renderBackgroundIcon(event) {
        if (!event.icon) {
            return "";
        }

        return html`<div class="event-background-icon"><i class="fa-duotone ${event.icon}"></i></div>`;
    }

    function renderDate(event) {
        const icon = `<a href="${event.googleLinks.googleCalendar}" class="event-icon"><i class="fa-duotone fa-calendar-range"></i></a>`;
        if (event.isFullDay && event.isMultipleDays) {
            return html`<div class="event-date">${icon}<span>${formatISODate(event.startDate)} bis ${formatISODate(event.endDate)}</span></div>`;
        } else if (event.isFullDay) {
            return html`<div class="event-date">${icon}<span>${formatISODate(event.startDate)}</span></div>`;
        } else if (event.isMultipleDays) {
            return html`<div class="event-date">${icon}<span>${formatISODateTime(event.startDate)} bis ${formatISODateTime(event.endDate)}</span></div>`;
        } else {
            return html`<div class="event-date">${icon}<span>${formatISODateTime(event.startDate)}</span></div>`;
        }
    }

    function renderLocation(event) {
        if (!event.location?.length) {
            return "";
        }

        return html`
            <div class="event-location">
                <a href="${event.googleLinks.googleMaps}" class="event-icon"><i class="fa-duotone fa-location-dot"></i></a>
                <span>${event.location}</span>
            </div>
        `;
    }
    function renderTags(event) {
        function renderTag(tag) {
            return html`<li><a href="?tags=${tag}" class="event-tag">${tag}</a></li>`;
        }

        if (!event.tags?.length) {
            return "";
        }
        return html`
            <div class="event-tags">
                <div class="event-icon">
                    <i class="fa-duotone fa-tags"></i>
                </div>
                <ul role="list">
                    ${event.tags.map(renderTag).join("")}
                </ul>
            </div>
        `;
    }

    function renderDescription(event) {
        if (!event.description) {
            return "";
        }
        return html`${md.render(event.description)}`;
    }

    function renderLinks(event) {
        function renderLink(link) {
            return html`
                <li><a href="${link.url}" class="event-link"><i class="fa-duotone fa-arrow-turn-down-right event-icon"></i> ${link.label}</a></li>
            `;
        }

        if (!event.links?.length) {
            return "";
        }

        return html`
            <ul role="list" class="event-links">
                ${event.links.map(renderLink).join("")}
            </ul>
        `;
    }

    return html`
        <li class="event-entry ${event.theme || ""}" data-event-tags="${event.tags?.join(",") || ''}">
            ${renderBackgroundIcon(event)}
            <h1 class="event-title">${event.title}</h1>
            <div class="event-details">
                ${renderDate(event)}
                ${renderLocation(event)}
                ${renderTags(event)}
            </div>
            <div class="event-description content">${renderDescription(event)}</div>
            ${renderLinks(event)}
        </li>
    `;
}

function EventFilters({ events, language }) {
    language = language || "de";

    function renderFilterList(filter) {
        return html`<li><a href="?tags=${filter.toLowerCase()}" data-event-filter="${filter.toLowerCase()}">${filter}</a></li>`;
    }

    const listOfTags = [... new Set(events.map(getListOfTags).flat())].sort();

    return html`
        <div class="event-filters">
            <h2>Filter</h2>
            <div class="event-filters-reset"><a href="?">${language === "de" ? "Filter entfernen" : "remove filter"} <i class="fa-duotone fa-circle-xmark"></i></a></div>
            <ul role="list">
                ${listOfTags.map(renderFilterList).join("")}
            </ul>
        </div>
    `;
}

function EventList({ events }) {
    function sortByStartDate(a, b) {
        return DateTime.fromISO(a.startDate) - DateTime.fromISO(b.startDate);
    }

    return html`
        <ul class="event-list" role="list">
            ${events.map(cleanUpGoogleEvent)
            .sort(sortByStartDate)
            .map(EventEntry)
            .join("")}
        </ul>
    `;
}

module.exports = { EventList, EventFilters };
