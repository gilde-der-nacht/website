import { For, Show, type Accessor, type JSX } from "solid-js";
import { Box } from "@common/components/Box";
import { TXT } from "@common/utils/texts";
import { useParams } from "@solidjs/router";
import type {
  Program,
  ProgramPublicEntry,
} from "@rst/components/anmeldung/api/program";
import { RouterLink } from "@common/components/Link";
import { ButtonWithIcon } from "@common/components/Button";
import { formatTime } from "@common/utils/time";
import { getDay } from "@rst/components/anmeldung/constant/time";
import type { ReserveAction } from "@rst/components/anmeldung/api/save";
import { ButtonLink } from "@common/components/ButtonLink";
import { arr, type Reactive } from "@common/utils/reactivity";
import type { Roles } from "@rst/components/anmeldung/api/meta";
import { Temporal } from "@js-temporal/polyfill";
import { type RegistrationUuid, type ReservationUuid } from "@common/utils/ids";
import { Reservation } from "@rst/components/anmeldung/components/Reservation";
import {
  getBookedEntries,
  getConflicts,
} from "@rst/components/anmeldung/utils/conflict";
import { Chip } from "@common/components/Chip";
import { Icon } from "@common/components/Icon";
import { join } from "@common/utils/strings";

export function ProgrammDetail(props: {
  reservations$: Reactive<ReserveAction[]>;
  showLoading$: Reactive<boolean>;
  programData: Accessor<Program>;
  isEditable: boolean;
  secret: RegistrationUuid;
  roles: Roles;
}): JSX.Element {
  const params = useParams();

  function getEntry(): ProgramPublicEntry | undefined {
    return props
      .programData()
      .publicEntries.find((e) => e.timeSlot.uuid === params.uuid);
  }

  return (
    <Show
      when={getEntry()}
      fallback={<Box type="danger">{TXT.error.gameroundUuidError}</Box>}
    >
      {(entry) => (
        <ProgramDetailContent
          reservations$={props.reservations$}
          showLoading$={props.showLoading$}
          entry={entry()}
          myReservations={props.reservations$.get()}
          isEditable={props.isEditable}
          addReservation={(reservation) =>
            arr.push(props.reservations$, reservation)
          }
          removeReservation={(reservationUuid) =>
            arr.remove(props.reservations$, (r) => r.uuid === reservationUuid)
          }
          programData={props.programData}
          secret={props.secret}
          roles={props.roles}
        />
      )}
    </Show>
  );
}

function ProgramDetailContent(props: {
  reservations$: Reactive<ReserveAction[]>;
  showLoading$: Reactive<boolean>;
  entry: ProgramPublicEntry;
  myReservations: ReserveAction[];
  addReservation: (reservation: ReserveAction) => void;
  removeReservation: (reservationUuid: ReservationUuid) => void;
  isEditable: boolean;
  programData: Accessor<Program>;
  secret: RegistrationUuid;
  roles: Roles;
}): JSX.Element {
  const day =
    getDay(Temporal.PlainDate.from(props.entry.timeSlot.slot.start.day)) ??
    "FRIDAY";

  const startTime = Temporal.PlainTime.from(
    props.entry.timeSlot.slot.start.time,
  );
  const endTime = startTime.add({
    hours: props.entry.timeSlot.slot.duration.hours,
  });

  const myBookedHours = () =>
    getBookedEntries(props.programData().publicEntries, props.secret);

  const conflictsWith = () => getConflicts(props.entry, myBookedHours());

  return (
    <>
      <Show when={conflictsWith().length > 0}>
        <div style="margin-block-end: 0.5rem; display: grid;">
          <Chip kind="danger">
            <Icon icon="triangle-exclamation" /> In Konflikt mit '
            {join(conflictsWith(), "', '", "' und '")}'!
          </Chip>
        </div>
      </Show>
      <div style="display: flex; gap: 1rem; flex-wrap: wrap">
        <div>
          {props.entry.system.length > 0 ? <h5>{props.entry.system}</h5> : null}
          <h3>{props.entry.title}</h3>
        </div>
        <RouterLink
          href="/programm"
          class="button-link"
          style="margin-inline-start: auto;"
        >
          <ButtonWithIcon
            icon="backward"
            label="Zurück zur Programm-Übersicht"
          />
        </RouterLink>
      </div>
      <div class="game-dialog">
        <ul role="list" style="display: grid; gap: 0.5rem;">
          <li>
            <strong style="color: var(--clr-accent-1);">Spielleitung:</strong>
            <div>{props.entry.organizer}</div>
          </li>
          <li>
            <strong style="color: var(--clr-accent-1);">Tag, Zeit:</strong>
            <div>
              {TXT.days[day]}, {formatTime(startTime)} - {formatTime(endTime)}{" "}
              Uhr
            </div>
          </li>
          <li>
            <strong style="color: var(--clr-accent-1);">Kategorien:</strong>
            <div>
              {props.entry.tagNames.length > 0 ? (
                props.entry.tagNames.join(", ")
              ) : (
                <em>keine Kategorien</em>
              )}
            </div>
          </li>
          <Show when={props.entry.language.trim()}>
            {(lang) => (
              <li>
                <strong style="color: var(--clr-accent-1);">Sprache:</strong>
                <div>{lang()}</div>
              </li>
            )}
          </Show>
          <Show when={props.entry.links.length > 0}>
            <li>
              <strong style="color: var(--clr-accent-1);">Links:</strong>
              <ul role="list" style="display: flex; gap: 0.5rem;">
                <For each={props.entry.links}>
                  {(link) => <ButtonLink label={link.label} link={link.link} />}
                </For>
              </ul>
            </li>
          </Show>
          <li>
            <strong style="color: var(--clr-accent-1);">
              Kurze Beschreibung:
            </strong>
            <div>{props.entry.shortDescription}</div>
          </li>
          <li>
            <strong style="color: var(--clr-accent-1);">
              Lange Beschreibung:
            </strong>
            <div>
              {props.entry.longDescription.trim().length > 0 ? (
                props.entry.longDescription
              ) : (
                <em>Keine lange Beschreibung...</em>
              )}
            </div>
          </li>
        </ul>
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <Reservation
            reservations$={props.reservations$}
            entry={props.entry}
            addReservation={props.addReservation}
            removeReservation={props.removeReservation}
            myReservations={props.myReservations}
            roles={props.roles}
            secret={props.secret}
            showLoading$={props.showLoading$}
            isEditable={props.isEditable}
          />
        </div>
      </div>
    </>
  );
}
