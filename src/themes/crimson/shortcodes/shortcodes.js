const { DateTime } = require("luxon");
const { formatISODate } = require("../filters/formatDate");

function TableContainer(content) {
    return `<div class="table-container">${content}</div>`;
}

function Form(content, { uid }) {
    return `
<form action="https://api.gildedernacht.ch/form/${uid}"
method="POST">${content}<button type="submit" class="button-accent">Absenden</button></form>
  `;
}

function Input({ label, name, type }) {
    return `
<label>${label}
    <input type="${type ? type : 'text'}" name="${name}" placeholder="${label}" required></input>
</label>
    `;
}

function Textarea({ label, name }) {
    return `
<label>${label}
    <textarea type="text" name="${name}" placeholder="${label}" required></textarea>
</label>
    `;
}

function cleanUpGoogleEvents({ htmlLink: link, summary: title, description, location, start, end }) {
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

function EventEntry(event) {
    return `<li>${JSON.stringify(event, null, 2)} || ${formatISODate(event.startDate)}</li>`;
}

function EventList({ events }) {
    return `<ul>${events.map(cleanUpGoogleEvents).sort(sortByStartDate).map(EventEntry)}</ul>`;
}

module.exports = { TableContainer, Form, Input, Textarea, EventList };
