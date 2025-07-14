import type { OlympEvent } from "@common/components/events";
import {
  formatDate,
  formatDateRange,
  formatDateTime,
} from "@common/components/utils";
import type { JSX } from "solid-js";
import { Icon } from "./Icon";

function getTheme(eventType: string): { theme: string; icon: string } | null {
  switch (eventType) {
    case "Luzerner Spieltage": {
      return {
        theme: "special",
        icon: "stars",
      };
    }
    case "Luzerner Rollenspieltage": {
      return {
        theme: "special",
        icon: "stars",
      };
    }
    case "Rollenspiel-Stammtisch": {
      return {
        theme: "success",
        icon: "comment-dots",
      };
    }
    default: {
      return null;
    }
  }
}

function renderBackgroundIcon(event: OlympEvent): JSX.Element {
  const entry = getTheme(event.type.label);
  if (entry === null || !entry.icon) {
    return "";
  }

  return (
    <div class="event-background-icon">
      <Icon icon={entry.icon as any} />
    </div>
  );
}

function renderDate(event: OlympEvent): JSX.Element {
  const icon = (
    <div class="event-icon">
      <Icon icon="calendar-range" />
    </div>
  );
  if (event.date.fullDay && event.date.multipleDays) {
    return (
      <div class="event-date">
        {icon}
        <span>{formatDateRange(event.date.start, event.date.end)}</span>
      </div>
    );
  } else if (event.date.fullDay) {
    return (
      <div class="event-date">
        {icon}
        <span>{formatDate(event.date.start)}</span>
      </div>
    );
  } else if (event.date.multipleDays) {
    return (
      <div class="event-date">
        {icon}
        <span>{formatDateRange(event.date.start, event.date.end)}</span>
      </div>
    );
  } else {
    return (
      <div class="event-date">
        {icon}
        <span>{formatDateTime(event.date.start)} Uhr</span>
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
        <Icon icon="location-dot" />
      </a>
      <span>{event.location.labelLong}</span>
    </div>
  );
}
function renderTags(event: OlympEvent): JSX.Element {
  function renderTag(tag: string) {
    return (
      <li>
        <a href={`?tags=${tag}`} class="event-tag">
          {tag}
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
        <Icon icon="tags" />
      </div>
      <ul>{event.tags.map(renderTag)}</ul>
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

  return `${event.type.description}\n\n${event.description}`;
}

function renderLinks(event: OlympEvent): JSX.Element {
  function renderLink(link: { url: string; label: string }) {
    return (
      <li>
        <a href={`${link.url}`} class="event-link">
          <Icon icon="arrow-turn-down-right" classes={["event-icon"]} />
          <span> {link.label}</span>
        </a>
      </li>
    );
  }

  if (!event.links?.length) {
    return "";
  }

  return <ul class="event-links">{event.links.map(renderLink)}</ul>;
}

type EventEntryProps = {
  event: OlympEvent;
};

function EventEntry(props: EventEntryProps): JSX.Element {
  return (
    <li
      class={`event-entry ${getTheme(props.event.type.label)?.theme || ""}`}
      data-event-tags={`${props.event.tags?.map((tag) => tag.trim()).join(",") || ""}`}
    >
      {renderBackgroundIcon(props.event)}
      <h3 class="event-title">{props.event.title}</h3>
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
  return a.date.start.getTime() - b.date.start.getTime();
}

export function EventListImpl(props: EventListProps): JSX.Element {
  return (
    <ul class="event-list">
      {props.events.toSorted(sortByStartDate).map((event) => (
        <EventEntry event={event} />
      ))}
    </ul>
  );
}
