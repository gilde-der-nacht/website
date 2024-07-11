import type { JSX } from "solid-js";
import type { OlympEvent } from "./events";
import { formatDate, formatDateRange, formatDateTime } from "./utils";

const ICONS_AND_COLORS: Record<number, { theme?: string; icon?: string }> = {
  // Spieltreffen
  1: {},
  // Rollenspieltage
  2: {
    theme: "special",
    icon: "stars",
  },
  // Spieltage
  3: {
    theme: "special",
    icon: "stars",
  },
  // Rollenspiel-Stammtisch
  4: {
    theme: "success",
    icon: "comment-dots",
  },
};

function renderBackgroundIcon(event: OlympEvent): JSX.Element {
  const entry = ICONS_AND_COLORS[event.type.id];
  if (entry === undefined || !entry.icon) {
    return "";
  }

  return (
    <div class="event-background-icon">
      <i class={`fa-duotone fa-${entry.icon}`}></i>
    </div>
  );
}

function renderDate(event: OlympEvent): JSX.Element {
  const icon = (
    <div class="event-icon">
      <i class="fa-duotone fa-calendar-range"></i>
    </div>
  );
  if (event.type_of_time === "multiple_full_days") {
    return (
      <div class="event-date">
        {icon}
        <span>{formatDateRange(event.start, event.end)}</span>
      </div>
    );
  } else if (event.type_of_time === "one_full_day") {
    return (
      <div class="event-date">
        {icon}
        <span>{formatDate(event.start)}</span>
      </div>
    );
  } else if (event.type_of_time === "multiple_partial_days") {
    return (
      <div class="event-date">
        {icon}
        <span>{formatDateRange(event.start, event.end)}</span>
      </div>
    );
  } else {
    return (
      <div class="event-date">
        {icon}
        <span>{formatDateTime(event.start)} Uhr</span>
      </div>
    );
  }
}

function renderLocation(event: OlympEvent): JSX.Element {
  if (!event.location === null) {
    return "";
  }

  return (
    <div class="event-location">
      <a href={`${event.location.url}`} class="event-icon">
        <i class="fa-duotone fa-location-dot"></i>
      </a>
      <span>{event.location.label_long}</span>
    </div>
  );
}
function renderTags(event: OlympEvent): JSX.Element {
  function renderTag(tag: { label: string }) {
    return (
      <li>
        <a href={`?tags=${tag.label}`} class="event-tag">
          {tag.label}
        </a>
      </li>
    );
  }

  if (!event.tags?.length) {
    return "";
  }
  return (
    <div class="event-tags">
      <div class="event-icon">
        <i class="fa-duotone fa-tags"></i>
      </div>
      <ul role="list">{event.tags.map(({ tags_id }) => renderTag(tags_id))}</ul>
    </div>
  );
}

function renderDescription(event: OlympEvent): JSX.Element {
  if (!event.description && !event.type.description) {
    return "";
  }

  if (!event.description) {
    return event.type.description;
  }

  if (!event.type.description) {
    return event.description;
  }

  return event.type.description + "\n\n" + event.description;
}

function renderLinks(event: OlympEvent): JSX.Element {
  function renderLink(link: { url: string; label: string }) {
    return (
      <li>
        <a href={`${link.url}`} class="event-link">
          <i class="fa-duotone fa-arrow-turn-down-right event-icon"></i>
          <span> {link.label}</span>
        </a>
      </li>
    );
  }

  if (!event.links?.length) {
    return "";
  }

  return (
    <ul role="list" class="event-links">
      {event.links.map(({ links_id }) => renderLink(links_id))}
    </ul>
  );
}

type EventEntryProps = {
  event: OlympEvent;
};

function EventEntry(props: EventEntryProps): JSX.Element {
  return (
    <li
      class={`event-entry ${ICONS_AND_COLORS[props.event.type.id]?.theme || ""}`}
      data-event-tags={`${props.event.tags?.map(({ tags_id: t }) => t.label.trim()).join(",") || ""}`}
    >
      {renderBackgroundIcon(props.event)}
      <h1 class="event-title">{props.event.title}</h1>
      <div class="event-details">
        {renderDate(props.event)}
        {renderLocation(props.event)}
        {renderTags(props.event)}
      </div>
      <div class="event-description content">
        {renderDescription(props.event)}
      </div>
      {renderLinks(props.event)}
    </li>
  );
}

type EventListProps = { events: OlympEvent[] };

function sortByStartDate(a: OlympEvent, b: OlympEvent) {
  return a.start.getTime() - b.start.getTime();
}

export function EventListImpl(props: EventListProps): JSX.Element {
  return (
    <ul class="event-list" role="list">
      {props.events.toSorted(sortByStartDate).map((event) => (
        <EventEntry event={event} />
      ))}
    </ul>
  );
}
