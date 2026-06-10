import type { JSX } from "solid-js";
import { TXT } from "@common/utils/texts";
import { ellipsis } from "@common/components/utils";
import { getDay } from "@rst/components/anmeldung/constant/time";
import { formatTime } from "@common/utils/time";
import { Link } from "@common/components/Link";
import type { Participating } from "@rst/components/anmeldung/api/save";
import { DESCR_SHORT_MAX_CHAR } from "@rst/components/anmeldung/constant/validation";
import type { ProgramPublicEntry } from "@rst/components/anmeldung/api/program";
import { Temporal } from "@js-temporal/polyfill";

export function Entry(props: {
  entry: ProgramPublicEntry;
  basePath: string;
  additionalReservations?: Participating[];
}): JSX.Element {
  function freeSeats(): number {
    if (props.entry.participation.seats.kind === "NO_LIMIT") {
      return 0;
    }
    return Math.max(
      props.entry.participation.seats.max -
        (typeof props.entry.participation.reserved === "number"
          ? props.entry.participation.reserved
          : props.entry.participation.reserved.length) -
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
      props.entry.participation.seats.kind === "WITH_LIMIT"
    ) {
      cls.push("gray");
    }
    return cls.join(" ");
  }

  const day = Temporal.PlainDate.from(props.entry.timeSlot.slot.start.day);
  const startTime = Temporal.PlainTime.from(
    props.entry.timeSlot.slot.start.time,
  );
  const endTime = startTime.add(
    Temporal.Duration.from(props.entry.timeSlot.slot.duration),
  );

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
            {TXT.days[getDay(day) ?? "FRIDAY"]}, {formatTime(startTime)} -{" "}
            {formatTime(endTime)} Uhr
          </span>
        </div>
        <div class="event-tags">
          {props.entry.participation.seats.kind === "NO_LIMIT" ? (
            <em>Teilnahme ohne Anmeldung möglich.</em>
          ) : (
            <>
              <strong>Freie Plätze:</strong> {freeSeats()} (von{" "}
              {props.entry.participation.seats.max})
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
          <Link
            href={`${props.basePath}/${props.entry.uuid}`}
            class="button-link"
          >
            <button class="event-link">
              {props.entry.participation.seats.kind === "WITH_LIMIT" ? (
                <span>Details & Teilnahme</span>
              ) : (
                <span>Details</span>
              )}
            </button>
          </Link>
        </li>
      </ul>
    </li>
  );
}
