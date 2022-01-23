const { DateTime } = require("luxon");
const { formatISODate, formatISODateTime } = require("../filters/formatDate");
const markdownLib = require("../plugins/markdown");

function html(strings, ...expr) {
    return strings
        .reduce((acc, curr, i) => acc + expr[i - 1] + curr)
        .replace(/\n\s*/g, "");
}

function TableContainer(content) {
    return html`<div class="table-container">${content}</div>`;
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
        const icon = `<a href="${event.links.googleCalendar}"><i class="fa-duotone fa-calendar-range"></i></a>`;
        if (event.isFullDay && event.isMultipleDays) {
            return html`<p>${icon} ${formatISODate(event.startDate)} bis ${formatISODate(event.endDate)}</p>`;
        } else if (event.isFullDay) {
            return html`<p>${icon} ${formatISODate(event.startDate)}</p>`;
        } else if (event.isMultipleDays) {
            return html`<p>${icon} ${formatISODateTime(event.startDate)} bis ${formatISODateTime(event.endDate)}</p>`;
        } else {
            return html`<p>${icon} ${formatISODateTime(event.startDate)}</p>`;
        }
    }

    function renderLocation(event) {
        return html`
            <p>
                <a href="${event.links.googleMaps}"><i class="fa-duotone fa-location-dot"></i></a>
                ${event.location}
            </p>
        `;
    }

    function renderTags(event) {
        return html`
            <div>
                <i class="fa-duotone fa-tags"></i>
                <ul role="list" class="event-links">
                <li><a href="?tag=tag1">tag1</a></li>
                <li><a href="?tag=tag2">tag2</a></li>
                </ul>
            </div>
        `;
    }

    function renderLinks(event) {
        return html`
            <ul role="list" class="event-links">
                <li><a href="">some links</a></li>
                <li><a href="">some other links</a></li>
            </ul>
        `;
    }

    return html`
        <li class="event-entry">
            <h1>${event.title}</h1>
            ${renderDate(event)}
            ${renderLocation(event)}
            ${renderTags(event)}
            <p>${event.description ? markdownLib.render(event.description) : ""}</p>
            ${renderLinks(event)}
        </li>
    `;
}

function EventList({ events }) {
    function cleanUpGoogleEvent({ htmlLink: link, summary: title, description, location, start, end }) {
        const startDate = DateTime.fromISO("dateTime" in start ? start.dateTime : start.date);
        const endDate = DateTime.fromISO("dateTime" in end ? end.dateTime : end.date);
        const isFullDay = "date" in start;
        const isMultipleDays = !startDate.hasSame(endDate, "day");
        const e = { title, description, location, links: { googleCalendar: link }, startDate, endDate, isFullDay, isMultipleDays };
        if (isFullDay) {
            e.endDate = DateTime.fromISO(e.endDate).minus({ seconds: 1 });
        }
        if (!(["discord", "online"].includes(location.toString().toLowerCase()))) {
            e.links.googleMaps = `http://maps.google.com/?q=${location}`;
        }
        return e;
    }

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
