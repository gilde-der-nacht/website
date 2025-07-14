import type { OlympEvent } from "@common/components/events";
import { Icon } from "@common/components/Icon";
import type { Language } from "@common/components/utils";
import type { JSX } from "solid-js";

type Props = {
  events: OlympEvent[];
  language?: Language;
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
      props.events.flatMap(({ tags }) => tags.map((tag) => tag.trim())),
    ),
  ].sort();

  return (
    <div class="event-filters">
      <h2>Filter</h2>
      <div class="event-filters-reset">
        <a href="?" data-event-filter-remove>
          {language === "de" ? "Filter entfernen" : "remove filter"}{" "}
          <Icon icon="circle-xmark" />
        </a>
      </div>
      <ul>{listOfTags.map(renderFilterList)}</ul>
    </div>
  );
}
