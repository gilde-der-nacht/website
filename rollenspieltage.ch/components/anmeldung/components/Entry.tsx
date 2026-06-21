import { Show, type JSX } from "solid-js";
import { TXT } from "@common/utils/texts";
import { ellipsis } from "@common/components/utils";
import { getDay } from "@rst/components/anmeldung/constant/time";
import { durationToTemporal, formatTime } from "@common/utils/time";
import type { ReserveAction } from "@rst/components/anmeldung/api/save";
import { DESCR_SHORT_MAX_CHAR } from "@rst/components/anmeldung/constant/validation";
import type { ProgramPublicEntry } from "@rst/components/anmeldung/api/program";
import type { Roles } from "@rst/components/anmeldung/api/meta";
import { UNAUTHORIZED } from "@common/utils/shared";
import { Icon } from "@common/components/Icon";
import { Dynamic } from "solid-js/web";
import type { LinkComponent } from "@common/components/Link";

export function Entry(props: {
  entry: ProgramPublicEntry;
  basePath: string;
  additionalReservations?: ReserveAction[];
  roles: Roles;
  isPublicSite: boolean;
  link: LinkComponent;
}): JSX.Element {
  function freeSeats(): number {
    return (
      Math.max(
        props.entry.participation.seats.max -
          (typeof props.entry.participation.reserved === "number"
            ? props.entry.participation.reserved
            : props.entry.participation.reserved.length),
        0,
      ) - 1
    );
  }

  function classes(): string {
    const cls: string[] = ["event-entry"];
    if (props.additionalReservations?.length ?? 0 > 0) {
      cls.push("success");
    } else if (props.entry.myEntry) {
      cls.push("success");
    } else if (freeSeats() === 0) {
      cls.push("gray");
    }
    return cls.join(" ");
  }

  const { day, startTime, endTime } = durationToTemporal(
    props.entry.timeSlot.slot,
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
          <strong>Freie Plätze:</strong> {freeSeats()} (von{" "}
          {props.entry.participation.seats.max})
        </div>
        <div class="event-tags">
          <strong>Kategorien:</strong>{" "}
          {props.entry.tagNames.length > 0 ? (
            props.entry.tagNames.join(", ")
          ) : (
            <em>keine Kategorien</em>
          )}
        </div>
        <div class="event-tags">
          <strong>Sprache:</strong>
          {props.entry.language}
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
        <Show
          when={
            props.roles.includes("admin") &&
            props.entry.secretForEditing !== UNAUTHORIZED
          }
        >
          <li>
            <a
              href={`/meine-anmeldung/#/erstellen/${props.entry.uuid}?secret=${props.entry.secretForEditing}`}
              target="_blank"
              class="event-link"
            >
              <span>
                <Icon icon="pencil" /> Editieren
              </span>
            </a>
          </li>
        </Show>
        <li>
          <Dynamic
            component={props.link}
            href={
              props.isPublicSite
                ? "/anmeldung"
                : `${props.basePath}/${props.entry.timeSlot.uuid}`
            }
            class="button-link"
          >
            <button class="event-link">
              <span>Details & Teilnahme</span>
            </button>
          </Dynamic>
        </li>
      </ul>
    </li>
  );
}
