import type { JSX } from "solid-js";
import type { OlympEvent } from "./events";

type Props = {
  events: OlympEvent[];
  language?: "en" | "de";
};
export function EventListFilters(props: Props): JSX.Element {
  const language = props.language ?? "de";

  function renderFilterList(filter: string): JSX.Element {
    return (
      <li>
        <a
          href={`?tags=${filter.toLowerCase()}`}
          data-event-filter={filter.toLowerCase()}
        >
          {filter}
        </a>
      </li>
    );
  }

  const listOfTags = [
    ...new Set(
      props.events.flatMap(({ tags }) =>
        tags.map(({ tags_id: t }) => t.label.trim()),
      ),
    ),
  ].sort();

  return (
    <div class="event-filters">
      <h2>Filter</h2>
      <div class="event-filters-reset">
        <a href="?" data-event-filter-remove>
          {language === "de" ? "Filter entfernen" : "remove filter"}{" "}
          <i class="fa-duotone fa-circle-xmark"></i>
        </a>
      </div>
      <ul role="list">{listOfTags.map(renderFilterList)}</ul>
    </div>
  );
}
