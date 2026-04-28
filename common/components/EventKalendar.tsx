import { Show, type JSX } from "solid-js";
import { loadPublishedEvents, toView } from "@common/components/events";
import { HydrationHelper } from "@common/components/HydrationHelper";
import { EventListImpl } from "@common/components/EventListImpl";
import { EventListFilters } from "./EventListFilters";

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
          <EventListFilters events={events.map(toView)} />
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
