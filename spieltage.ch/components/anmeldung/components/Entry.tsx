import type { JSX } from "solid-js";
import type { PublicProgramEntry } from "@lst/components/anmeldung/api/public";
import { TXT } from "@common/utils/texts";
import { ellipsis } from "@common/components/utils";
import { getDay } from "@lst/components/anmeldung/constant/time";
import { formatTime } from "@common/utils/time";
import { DESCR_SHORT_MAX_CHAR } from "@rst/components/anmeldung/forms/validation";
import { Link } from "@common/components/Link";
import type { Reservation } from "@lst/components/anmeldung/api/save";

export function Entry(props: {
  entry: PublicProgramEntry;
  basePath: string;
  additionalReservations?: Reservation[];
}): JSX.Element {
  function freeSeats(): number {
    if (props.entry.participating.kind === "NONE") {
      return 0;
    }
    return Math.max(
      props.entry.participating.maxSeats -
        props.entry.participating.reserved.length -
        (props.additionalReservations?.length ?? 0),
      0,
    );
  }

  function classes(): string {
    const cls: string[] = ["event-entry"];
    if (props.additionalReservations?.length ?? 0 > 0) {
      cls.push("success");
    } else if (
      freeSeats() === 0 &&
      props.entry.participating.kind === "LIMITED"
    ) {
      cls.push("gray");
    }
    return cls.join(" ");
  }

  return (
    <li class={classes()}>
      <h3 class="event-title">{props.entry.title}</h3>
      <div class="event-details">
        <div class="event-tags">
          <strong>Organisiert durch:</strong>
          {props.entry.organizer}
        </div>
        <div class="event-tags">
          <strong>Tag, Zeit:</strong>
          <span>
            {TXT.days[getDay(props.entry.slot.day) ?? "FRIDAY"]},{" "}
            {formatTime(props.entry.slot.start)} -{" "}
            {formatTime(props.entry.slot.end)} Uhr
          </span>
        </div>
        <div class="event-tags">
          {props.entry.participating.kind === "NONE" ? (
            <em>Teilnahme ohne Anmeldung möglich.</em>
          ) : (
            <>
              <strong>Freie Plätze:</strong> {freeSeats()} (von{" "}
              {props.entry.participating.maxSeats})
            </>
          )}
        </div>
        <div class="event-tags">
          <strong>Kategorien:</strong>{" "}
          {props.entry.tagNames.trim().length > 0 ? (
            props.entry.tagNames
              .split(",")
              .map((e) => e.trim())
              .filter((e) => e.length > 0)
              .join(", ")
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
          <Link
            href={`${props.basePath}/${props.entry.uuid}`}
            class="button-link"
          >
            <button class="event-link">
              <span>Details & Teilnahme</span>
            </button>
          </Link>
        </li>
      </ul>
    </li>
  );
}
