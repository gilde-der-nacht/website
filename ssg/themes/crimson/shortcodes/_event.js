const { DateTime } = require("luxon");
const { md } = require("../plugins/markdown");
const { formatISODate, formatISODateTime } = require("../filters/formatDate");
const html = require("./helper/html");

const ICONS_AND_COLORS = {
  // Spieltreffen
  1: {},
  // Rollenspieltage
  2: {
    theme: "special",
    icon: "stars"
  },
  // Spieltage
  3: {
    theme: "special",
    icon: "stars"
  }
};

function EventEntry(event) {
  function renderBackgroundIcon(event) {
    const { icon } = ICONS_AND_COLORS[event.type.id];
    if (!icon) {
      return "";
    }

    return html`<div class="event-background-icon"><i class="fa-duotone fa-${icon}"></i></div>`;
  }

  function renderDate(event) {
    const icon = `<a href="${'TODO'}" class="event-icon"><i class="fa-duotone fa-calendar-range"></i></a>`;
    if (event.type_of_time === "multiple_full_days") {
      return html`<div class="event-date">${icon}<span>${formatISODate(event.start)} bis ${formatISODate(event.end)}</span></div>`;
    } else if (event.type_of_time === "single_full_day") {
      return html`<div class="event-date">${icon}<span>${formatISODate(event.start)}</span></div>`;
    } else if (event.type_of_time === "multiple_partial_days") {
      return html`<div class="event-date">${icon}<span>${formatISODateTime(event.start)} bis ${formatISODateTime(event.end)}</span></div>`;
    } else {
      return html`<div class="event-date">${icon}<span>${formatISODateTime(event.start)}</span></div>`;
    }
  }

  function renderLocation(event) {
    if (!event.location === null) {
      return "";
    }

    return html`
            <div class="event-location">
                <a href="${ event.location.url }" class="event-icon"><i class="fa-duotone fa-location-dot"></i></a>
                <span>${event.location.label_long}</span>
            </div>
        `;
  }
  function renderTags(event) {
    function renderTag(tag) {
      return html`<li><a href="?tags=${tag.label}" class="event-tag">${tag.label}</a></li>`;
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
    if (!event.description && !event.type.description) {
      return "";
    }

    if (!event.description) {
      return html`${md.render(event.type.description)}`;
    }

    if (!event.type.description) {
      return html`${md.render(event.description)}`;
    }

    return html`${md.render(event.type.description + "\n\n" + event.description)}`;
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

  if (!event.type) {
    return "";
  }

  return html`
        <li class="event-entry ${ICONS_AND_COLORS[event.type.id].theme || ""}" data-event-tags="${event.tags?.map(t => t.label.trim()).join(",") || ''}">
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

  const listOfTags = [... new Set(events.map(({tags}) => tags.map(t => t.label.trim())).flat())].sort();

  return html`
        <div class="event-filters">
            <h2>Filter</h2>
            <div class="event-filters-reset"><a href="?" data-event-filter-remove>${language === "de" ? "Filter entfernen" : "remove filter"} <i class="fa-duotone fa-circle-xmark"></i></a></div>
            <ul role="list">
                ${listOfTags.map(renderFilterList).join("")}
            </ul>
        </div>
    `;
}

function EventList({ events }) {
  function sortByStartDate(a, b) {
    return DateTime.fromISO(a.start) - DateTime.fromISO(b.start);
  }

  function onlyFutureEvents(event) {
    return DateTime.now() < DateTime.fromISO(event.end);
  }

  return html`
        <ul class="event-list" role="list">
            ${events // .map(cleanUpGoogleEvent)
      .filter(onlyFutureEvents)
      .sort(sortByStartDate)
      .map(EventEntry)
      .join("")}
        </ul>
    `;
}

module.exports = { EventList, EventFilters };
