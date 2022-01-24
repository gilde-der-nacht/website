const { DateTime } = require("luxon");
const { formatISODate, formatISODateTime } = require("../filters/formatDate");
const { cleanUpGoogleEvent } = require("./helper/google-calendar");
const markdownLib = require("../plugins/markdown");

function html(strings, ...expr) {
    return strings
        .reduce((acc, curr, i) => acc + expr[i - 1] + curr)
        .replace(/\n\s*/g, "");
}

function TableContainer(content) {
    return html`<div class="table-container">${markdownLib.render(content)}</div>`;
}

function Form(content, { uid }) {
    return html`
        <form action="https://api.gildedernacht.ch/form/${uid}" method="POST">
            ${content}
            <button type="submit" class="button-accent">Absenden</button>
        </form>
  `;
}

function Input({ label, name, type }) {
    return html`
        <label>${label}
            <input type="${type ? type : 'text'}" name="${name}" placeholder="${label}" required/>
        </label>
    `;
}

function Textarea({ label, name }) {
    return html`
        <label>${label}
            <textarea type="text" name="${name}" placeholder="${label}" required></textarea>
        </label>
    `;
}

function EventEntry(event) {
    function renderDate(event) {
        const icon = `<a href="${event.links.googleCalendar}" class="event-icon"><i class="fa-duotone fa-calendar-range"></i></a>`;
        if (event.isFullDay && event.isMultipleDays) {
            return html`<div class="event-date">${icon}${formatISODate(event.startDate)} bis ${formatISODate(event.endDate)}</div>`;
        } else if (event.isFullDay) {
            return html`<div class="event-date">${icon}${formatISODate(event.startDate)}</div>`;
        } else if (event.isMultipleDays) {
            return html`<div class="event-date">${icon}${formatISODateTime(event.startDate)} bis ${formatISODateTime(event.endDate)}</div>`;
        } else {
            return html`<div class="event-date">${icon}${formatISODateTime(event.startDate)}</div>`;
        }
    }

    function renderLocation(event) {
        return html`
            <div class="event-location">
                <a href="${event.links.googleMaps}" class="event-icon"><i class="fa-duotone fa-location-dot"></i></a>
                ${event.location}
            </div>
        `;
    }

    function renderTags(event) {
        return html`
            <div class="event-tags">
                <div class="event-icon">
                    <i class="fa-duotone fa-tags"></i>
                </div>
                <ul role="list">
                <li><a href="?tag=tag1" class="event-tag">tag1</a></li>
                <li><a href="?tag=tag2" class="event-tag">tag2</a></li>
                </ul>
            </div>
        `;
    }

    function renderDescription(event) {
        if (!event.description) {
            return "";
        }
        return html`${markdownLib.render(event.description)}`;
    }

    function renderLinks(event) {
        return html`
            <ul role="list" class="event-links">
                <li><a href="" class="event-link">some links</a></li>
                <li><a href="" class="event-link">some other links</a></li>
            </ul>
        `;
    }

    return html`
        <li class="event-entry">
            <div class="event-background-icon"><i class="fa-duotone fa-alien-8bit"></i></div>
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

module.exports = { TableContainer, Form, Input, Textarea, EventList };
