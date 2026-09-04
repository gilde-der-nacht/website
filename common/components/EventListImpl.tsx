import { Temporal } from "@js-temporal/polyfill";
import { Match, Show, Switch, type JSX } from "solid-js";
import type { OlympEventView } from "@common/components/events";
import {
  formatSimpleDate,
  formatEventDateTime,
  formatSimpleDateTime,
} from "@common/components/utils";
import { Icon } from "@common/components/Icon";
import { Heading } from "@common/components/Heading";
import { Box } from "@common/components/Box";

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
      if (eventType.includes("Spieltreffen")) {
        return null;
      }
      return {
        theme: "warning",
        icon: "dice",
      };
    }
  }
}

function renderBackgroundIcon(event: OlympEventView): JSX.Element {
  const entry = getTheme(event.type);
  if (entry === null || !entry.icon) {
    return "";
  }

  return (
    <div class="event-background-icon">
      <Icon icon={entry.icon as any} />
    </div>
  );
}

function isFullDay(event: OlympEventView): boolean {
  return !("hour" in event.date.startDate);
}

function isMultipleDays(event: OlympEventView): boolean {
  const { startDate, endDate } = event.date;
  if (endDate === null) {
    return false;
  }
  return !(
    startDate.year === endDate.year &&
    startDate.month === endDate.month &&
    startDate.day === endDate.day
  );
}

function renderDate(event: OlympEventView): JSX.Element {
  const icon = (
    <div class="event-icon">
      <Icon icon="calendar-range" />
    </div>
  );
  if (isFullDay(event) && isMultipleDays(event)) {
    return (
      <div class="event-date">
        {icon}
        <span>{formatEventDateTime(event.date)}</span>
      </div>
    );
  } else if (isFullDay(event)) {
    return (
      <div class="event-date">
        {icon}
        <span>{formatSimpleDate(event.date)}</span>
      </div>
    );
  } else if (isMultipleDays(event)) {
    return (
      <div class="event-date">
        {icon}
        <span>{formatEventDateTime(event.date)}</span>
      </div>
    );
  } else {
    return (
      <div class="event-date">
        {icon}
        <span>{formatSimpleDateTime(event.date)} Uhr</span>
      </div>
    );
  }
}

function renderLocation(event: OlympEventView): JSX.Element {
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
function renderTags(event: OlympEventView): JSX.Element {
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
      <ul role="list">{event.tags.map(renderTag)}</ul>
    </div>
  );
}

function renderLinks(event: OlympEventView): JSX.Element {
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

  return (
    <ul role="list" class="event-links">
      {event.links.map(renderLink)}
    </ul>
  );
}

type EventEntryProps = {
  event: OlympEventView;
};

function EventEntry(props: EventEntryProps): JSX.Element {
  return (
    <li
      class={`event-entry ${getTheme(props.event.type)?.theme || ""}`}
      data-event-tags={`${props.event.tags?.map((tag) => tag.trim()).join(",") || ""}`}
    >
      {renderBackgroundIcon(props.event)}
      <h3 class="event-title">{props.event.title}</h3>
      <div class="event-details">
        {renderDate(props.event)}
        {renderLocation(props.event)}
        {renderTags(props.event)}
      </div>
      <div class="event-description content">{props.event.description}</div>
      {renderLinks(props.event)}
    </li>
  );
}

type EventListProps = { events: OlympEventView[] };

function sortByStartDate(a: OlympEventView, b: OlympEventView) {
  const {
    date: { startDate: startDateA },
  } = a;
  const {
    date: { startDate: startDateB },
  } = b;
  if (startDateA.year !== startDateB.year) {
    return startDateA.year - startDateB.year;
  }
  if (startDateA.month !== startDateB.month) {
    return startDateA.month - startDateB.month;
  }
  if (startDateA.day !== startDateB.day) {
    return startDateA.day - startDateB.day;
  }

  const startHourA = "hour" in startDateA ? startDateA.hour : 0;
  const startHourB = "hour" in startDateB ? startDateB.hour : 0;

  if (startHourA !== startHourB) {
    return startHourA - startHourB;
  }

  const startMinuteA = "hour" in startDateA ? startDateA.hour : 0;
  const startMinuteB = "hour" in startDateB ? startDateB.hour : 0;

  return startMinuteA - startMinuteB;
}

export function EventListImpl(props: EventListProps): JSX.Element {
  return (
    <Show
      when={props.events.length > 0}
      fallback={<Box type="special">Keine Einträge gefunden.</Box>}
    >
      <ul class="event-list" role="list">
        {props.events.toSorted(sortByStartDate).map((event) => (
          <EventEntry event={event} />
        ))}
      </ul>
    </Show>
  );
}

type Overview = {
  nextEvent: OlympEventView | undefined;
  preview: OlympEventView[];
};
function getOverviewItems(events: OlympEventView[]): Overview {
  const sortedByDate = events.toSorted(sortByStartDate);
  const [nextEvent, ...rest] = sortedByDate;

  let spieltreffenFound = false;
  let otherFound = false;

  const preview = rest.filter((event) => {
    const now = Temporal.Now.plainDateISO();
    const daysUntil = event.date.startDate.since(now).days;
    if (daysUntil < 0 || daysUntil > 13 * 31) {
      // Events that are in the past or more than ~13 months in the future will not be shown in the preview
      return false;
    }

    switch (event.type) {
      case "Spieltreffen": {
        if (!spieltreffenFound) {
          spieltreffenFound = true;
          return true;
        }
        return false;
      }
      case "Luzerner Spieltage": {
        return true;
      }
      case "Luzerner Rollenspieltage": {
        return true;
      }
      case "Spielweekend": {
        return true;
      }
      default: {
        if (!otherFound) {
          otherFound = true;
          return true;
        }
        return false;
      }
    }
  });

  return {
    nextEvent,
    preview,
  };
}

export function EventListOverview(props: EventListProps): JSX.Element {
  const { nextEvent, preview } = getOverviewItems(props.events);

  return (
    <>
      <Switch fallback={<Box type="special">Keine Einträge gefunden.</Box>}>
        <Match when={nextEvent}>
          {(next) => (
            <>
              <Heading
                level={3}
                title="Nächster Event"
                moreLink={{
                  label: "Alle Events",
                  link: "/kalender",
                  icon: "arrow-right",
                }}
              />
              <ul class="event-list" role="list">
                <EventEntry event={next()} />
              </ul>
            </>
          )}
        </Match>
      </Switch>
      <Show when={preview.length > 0}>
        <>
          <Heading level={3} title="Ausblick" />
          <ul class="event-list" role="list">
            {preview.map((event) => (
              <EventEntry event={event} />
            ))}
          </ul>
          <Box link="/kalender" linkLabel="Kalender">
            Zu allen Events
          </Box>
        </>
      </Show>
    </>
  );
}
