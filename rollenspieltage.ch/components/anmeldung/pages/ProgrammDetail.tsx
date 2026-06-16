import { For, Match, Show, Switch, type Accessor, type JSX } from "solid-js";
import { Box, SimpleBox } from "@common/components/Box";
import { TXT } from "@common/utils/texts";
import { useParams } from "@solidjs/router";
import type {
  Program,
  ProgramPublicEntry,
} from "@rst/components/anmeldung/api/program";
import { RouterLink } from "@common/components/Link";
import { ButtonWithIcon, IconOnlyButton } from "@common/components/Button";
import { formatTime, toRange } from "@common/utils/time";
import { getDay } from "@rst/components/anmeldung/constant/time";
import type { Participating } from "@rst/components/anmeldung/api/save";
import { InputButton } from "@common/components/InputButton";
import { ButtonLink } from "@common/components/ButtonLink";
import { arr, type Reactive } from "@common/utils/reactivity";
import type { Roles } from "@rst/components/anmeldung/api/meta";
import { getCurrentTimestamp } from "@common/utils/shared";
import { Temporal } from "@js-temporal/polyfill";
import { assert, ellipsis } from "@common/components/utils";

export function ProgrammDetail(props: {
  reservations$: Reactive<Participating[]>;
  programData: Accessor<Program>;
  isEditable: boolean;
  roles: Roles;
}): JSX.Element {
  const uuid = useParams().uuid ?? "no-uuid-found";

  return (
    <Show
      when={props
        .programData()
        .publicEntries.find((e) => e.timeSlot.uuid === uuid)}
      fallback={<Box type="danger">{TXT.error.gameroundUuidError}</Box>}
    >
      {(entry) => (
        <ProgramDetailContent
          entry={entry()}
          myReservations={props.reservations$.get()}
          isEditable={props.isEditable}
          addReservation={(reservation) =>
            arr.push(props.reservations$, reservation)
          }
          removeReservation={(reservationUuid) => {
            arr.remove(props.reservations$, (r) => r.uuid !== reservationUuid);
          }}
          programData={props.programData}
          roles={props.roles}
        />
      )}
    </Show>
  );
}

function ProgramDetailContent(props: {
  entry: ProgramPublicEntry;
  myReservations: Participating[];
  addReservation: (reservation: Participating) => void;
  removeReservation: (reservationUuid: string) => void;
  isEditable: boolean;
  programData: Accessor<Program>;
  roles: Roles;
}): JSX.Element {
  const day =
    getDay(Temporal.PlainDate.from(props.entry.timeSlot.slot.start.day)) ??
    "FRIDAY";

  const myReservations = () =>
    props.myReservations.filter(
      (r) => r.entryUuid === props.entry.timeSlot.uuid,
    );

  const hasReservedForThemselves = (): boolean => {
    return myReservations().some((r) => r.name.kind === "SELF");
  };

  const range = () => {
    if (props.entry.participation.seats.kind === "NO_LIMIT") {
      return [];
    }
    return toRange(props.entry.participation.seats.max).map((i) => {
      assert(props.entry.participation.seats.kind !== "NO_LIMIT", "");

      const myReservation = myReservations()[i];
      if (myReservation !== undefined) {
        if (myReservation.name.kind === "SELF") {
          return {
            kind: "SELF",
            uuid: myReservation.uuid,
          } as const;
        } else {
          return {
            kind: "FRIEND",
            uuid: myReservation.uuid,
            name: myReservation.name.friendsName,
          } as const;
        }
      }

      if (i === props.entry.participation.seats.max - 1) {
        return {
          kind: "RESERVED_LOCAL",
        } as const;
      }

      const allReservations = props.entry.participation.reserved;

      if (typeof allReservations === "number") {
        if (allReservations > i) {
          return {
            kind: "RESERVED_OTHER",
          } as const;
        } else if (
          (allReservations === i || i === 0) &&
          !hasReservedForThemselves()
        ) {
          return { kind: "FREE_SELF" } as const;
        } else {
          return { kind: "FREE_FRIEND" } as const;
        }
      } else {
        const myReservationUuids = myReservations().map(
          (reservation) => reservation.uuid,
        );
        const externalReservations = allReservations.filter(
          (reservation) => !myReservationUuids.includes(reservation.uuid),
        );
        const currentExternalReservation =
          externalReservations[i - myReservations().length];
        if (currentExternalReservation !== undefined) {
          return {
            kind: "RESERVED_OTHER_WITH_NAME",
            name: currentExternalReservation.name,
          } as const;
        } else if (
          allReservations.length === i &&
          !hasReservedForThemselves()
        ) {
          return { kind: "FREE_SELF" } as const;
        } else {
          return { kind: "FREE_FRIEND" } as const;
        }
      }
    });
  };

  const startTime = Temporal.PlainTime.from(
    props.entry.timeSlot.slot.start.time,
  );
  const endTime = startTime.add({
    hours: props.entry.timeSlot.slot.duration.hours,
  });

  return (
    <>
      <div style="display: flex; gap: 1rem; flex-wrap: wrap">
        <h3>{props.entry.title}</h3>
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
              <ul role="list">
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
          <Box type="special">
            Wir schicken dir eine E-Mail, sobald du dich für Spielrunden
            anmelden kannst.
          </Box>
          <Switch>
            <Match when={props.roles.includes("admin")}>
              <div class="reservations">
                <h5 style="margin-block-start: 0">Plätze reservieren</h5>
                <div class="reservation-table">
                  <For
                    each={range()}
                    fallback={<em>Teilnahme ohne Anmeldung möglich.</em>}
                  >
                    {(seat, i) => (
                      <>
                        <div class="count">{i() + 1}</div>
                        <Switch>
                          <Match when={seat.kind === "RESERVED_OTHER"}>
                            <Box>Bereits reserviert</Box>
                          </Match>
                          <Match
                            when={seat.kind === "RESERVED_OTHER_WITH_NAME"}
                          >
                            <Box>Bereits reserviert ({seat.name})</Box>
                          </Match>
                          <Match when={!props.isEditable}>
                            <Box>Freier Platz</Box>
                          </Match>
                          <Match when={seat.kind === "SELF"}>
                            <SimpleBox type="success">
                              <div class="reservation-table-entry">
                                <p>Reserviert für mich </p>
                                <IconOnlyButton
                                  icon="trash"
                                  onClick={() => {
                                    props.removeReservation(
                                      seat.kind === "SELF"
                                        ? seat.uuid
                                        : "should not happen",
                                    );
                                  }}
                                />
                              </div>
                            </SimpleBox>
                          </Match>
                          <Match when={seat.kind === "FRIEND"}>
                            <SimpleBox type="success">
                              <div class="reservation-table-entry">
                                <p>
                                  Reserviert für "
                                  {seat.kind === "FRIEND"
                                    ? seat.name
                                    : "[Fehler beim Laden]"}
                                  "
                                </p>
                                <IconOnlyButton
                                  icon="trash"
                                  onClick={() => {
                                    props.removeReservation(
                                      seat.kind === "FRIEND"
                                        ? seat.uuid
                                        : "should not happen",
                                    );
                                  }}
                                />
                              </div>
                            </SimpleBox>
                          </Match>
                          <Match when={seat.kind === "FREE_SELF"}>
                            <ButtonWithIcon
                              icon="person-to-portal"
                              label="Mich anmelden"
                              kind="success"
                              onClick={() => {
                                props.addReservation({
                                  entryUuid: props.entry.timeSlot.uuid,
                                  uuid: crypto.randomUUID(),
                                  timestamp: getCurrentTimestamp(),
                                  name: {
                                    kind: "SELF",
                                  },
                                });
                              }}
                            />
                          </Match>
                          <Match when={seat.kind === "FREE_FRIEND"}>
                            <InputButton
                              label="Begleitperson anmelden"
                              addFriend={(name) => {
                                props.addReservation({
                                  entryUuid: props.entry.timeSlot.uuid,
                                  timestamp: getCurrentTimestamp(),
                                  name: {
                                    kind: "FRIEND",
                                    friendsName: name,
                                  },
                                  uuid: crypto.randomUUID(),
                                });
                              }}
                            />
                          </Match>
                          <Match when={seat.kind === "RESERVED_LOCAL"}>
                            <Box>
                              <em>Reserviert für Spontane</em>
                            </Box>
                          </Match>
                        </Switch>
                      </>
                    )}
                  </For>
                </div>
              </div>
              <RouterLink
                href={`/warteliste/${props.entry.timeSlot.uuid}`}
                class="button-link"
                style="inline-size: 100%;"
              >
                <ButtonWithIcon
                  icon="money-check-pen"
                  label={`Zur Warteliste von '${ellipsis(props.entry.title, 20)}'`}
                  style="inline-size: 100%;"
                />
              </RouterLink>
            </Match>
          </Switch>
        </div>
      </div>
    </>
  );
}
