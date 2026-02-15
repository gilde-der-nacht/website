import type { JSX } from "solid-js";
import type { PublicProgramEntry } from "@lst/components/anmeldung/api/public";
import { TXT } from "@common/utils/texts";
import { ellipsis } from "@common/components/utils";
import { getDay } from "@lst/components/anmeldung/constant/time";
import { formatTime } from "@common/utils/time";
import { DESCR_SHORT_MAX_CHAR } from "@rst/components/anmeldung/forms/validation";
import { A } from "@solidjs/router";

export function Entry(props: {
  entry: PublicProgramEntry;
  reservations: number;
  basePath: string;
  link: (path: string) => string;
}): JSX.Element {
  return (
    <li class="event-entry">
      <h3 class="event-title">{props.entry.title}</h3>
      <div class="event-details">
        <div class="event-tags">
          <strong>Organisiert durch:</strong>
          {props.entry.organizer}
        </div>
        <div class="event-tags">
          <strong>Tag, Zeit:</strong>
          <span>
            {TXT.days[getDay(props.entry.timeSlot.startDate) ?? "FRIDAY"]},{" "}
            {formatTime(props.entry.timeSlot.startDate.toPlainTime())}: -{" "}
            {formatTime(props.entry.timeSlot.endDate.toPlainTime())} Uhr
          </span>
        </div>
        <div class="event-tags">
          {props.entry.participating.kind === "NONE" ? (
            <em>Teilnahme ohne Anmeldung möglich.</em>
          ) : (
            <>
              <strong>Freie Plätze:</strong>{" "}
              {Math.max(
                props.entry.participating.maxSeats - props.reservations,
                0,
              )}{" "}
              (von {props.entry.participating.maxSeats})
            </>
          )}
        </div>
        <div class="event-tags">
          <strong>Kategorien:</strong>{" "}
          {props.entry.tagNames.length > 0 ? (
            props.entry.tagNames.join(", ")
          ) : (
            <em>keine Kategorien</em>
          )}
        </div>
      </div>
      <div class="event-description content">
        <p>
          <strong>Kurzbeschreibung:</strong>
          <br />
          {ellipsis(props.entry.shortDescription, DESCR_SHORT_MAX_CHAR)}
        </p>
      </div>
      <ul role="list" class="event-links">
        <li>
          <A
            href={props.link(`${props.basePath}/${props.entry.uuid}`)}
            class="button-link"
          >
            <button class="event-link">
              <span>Details & Teilnahme</span>
            </button>
          </A>
        </li>
      </ul>
    </li>
  );
}
