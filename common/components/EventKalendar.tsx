import { type JSX } from "solid-js";
import { loadPublishedEvents, toView } from "@common/components/events";
import { HydrationHelper } from "@common/components/HydrationHelper";
import { EventListImpl } from "@common/components/EventListImpl";

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
      {(data, FeedbackBox) => (
        <>
          <FeedbackBox />
          <EventListImpl events={data.map(toView)} />
        </>
      )}
    </HydrationHelper>
  );
}
