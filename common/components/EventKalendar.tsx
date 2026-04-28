import { Show, type JSX } from "solid-js";
import { loadPublishedEvents, toView } from "@common/components/events";
import { HydrationHelper } from "@common/components/HydrationHelper";
import { EventListImpl } from "@common/components/EventListImpl";
import { EventListFilters } from "@common/components/EventListFilters";
import { ButtonWithIcon } from "@common/components/Button";

export function EventKalendar(): JSX.Element {
  return (
    <HydrationHelper
      strategy={{
        kind: "CLIENT_REFRESH",
        showLoading: false,
        showOutdatedData: true,
      }}
      fetcher={loadPublishedEvents}
    >
      {(events, FeedbackBox) => (
        <>
          <div style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: center; justify-content: space-between; margin-block-end: 1rem;">
            <EventListFilters events={events.map(toView)} />
            <a href="#kalender-abonnieren" class="button-link">
              <ButtonWithIcon icon="arrow-down" label="Kalender abonnieren" />
            </a>
          </div>
          <Show when={FeedbackBox !== null}>
            <div style="margin-block-end: 1rem; max-width: max-content;">
              <FeedbackBox />
            </div>
          </Show>
          <EventListImpl events={events.map(toView)} />
        </>
      )}
    </HydrationHelper>
  );
}
