import {
  unsafeToReservationUuid,
  type RegistrationUuid,
  type ReservationUuid,
  type TimeslotUuid,
} from "@common/utils/ids";
import { For, Match, Show, Switch, type JSX } from "solid-js";
import type { ReserveAction } from "@rst/components/anmeldung/api/save";
import { arr, createReactive, type Reactive } from "@common/utils/reactivity";
import { Box, SimpleBox } from "@common/components/Box";
import {
  Button,
  ButtonWithIcon,
  IconOnlyButton,
} from "@common/components/Button";
import { join } from "@common/utils/strings";
import { getCurrentTimestamp } from "@common/utils/shared";
import type { ProgramPublicEntry } from "@rst/components/anmeldung/api/program";
import { toRange } from "@common/utils/time";
import { InputButton } from "@common/components/InputButton";
import {
  orderReservations,
  type GroupedReservation,
} from "@rst/components/anmeldung/utils/waitinglist";
import type { Roles } from "@rst/components/anmeldung/api/meta";

export function ReservationForm(props: {
  timeslotUuid: TimeslotUuid;
  reservations$: Reactive<ReserveAction[]>;
  rows: number;
}): JSX.Element {
  const reservations = () =>
    props.reservations$.get().filter((r) => r.entryUuid === props.timeslotUuid);

  function getFriendNames(): string {
    return reservations()
      .map((r) => (r.name.kind === "FRIEND" ? r.name.friendsName : null))
      .filter((r) => r !== null)
      .join(", ");
  }

  const names$ = createReactive(getFriendNames());
  const editable$ = createReactive(false);

  function updateReservation(names: string[]): void {
    if (reservations().length === 0) {
      // new reservation
      arr.push(props.reservations$, {
        kind: "ADD",
        entryUuid: props.timeslotUuid,
        uuid: unsafeToReservationUuid(crypto.randomUUID()),
        timestamp: getCurrentTimestamp(),
        name: {
          kind: "SELF",
        },
      });
      names.forEach((name) => {
        arr.push(props.reservations$, {
          kind: "ADD",
          entryUuid: props.timeslotUuid,
          timestamp: getCurrentTimestamp(),
          name: {
            kind: "FRIEND",
            friendsName: name,
          },
          uuid: unsafeToReservationUuid(crypto.randomUUID()),
        });
      });
    } else {
      names.forEach((name, i) => {
        if (i + 2 > reservations().length) {
          // added more friends
          arr.push(props.reservations$, {
            kind: "ADD",
            entryUuid: props.timeslotUuid,
            timestamp: getCurrentTimestamp(),
            name: {
              kind: "FRIEND",
              friendsName: name,
            },
            uuid: unsafeToReservationUuid(crypto.randomUUID()),
          });
        }
      });

      // update reservation
      reservations().forEach((reservation, i) => {
        if (i === 0) {
          arr.push(props.reservations$, {
            kind: "UPDATE",
            entryUuid: reservation.entryUuid,
            uuid: reservation.uuid,
            name: { kind: "SELF" },
            timestamp: getCurrentTimestamp(),
          });
        } else {
          const friendsName = names[i - 1];
          if (friendsName !== undefined) {
            arr.push(props.reservations$, {
              kind: "UPDATE",
              entryUuid: reservation.entryUuid,
              uuid: reservation.uuid,
              name: { kind: "FRIEND", friendsName },
              timestamp: getCurrentTimestamp(),
            });
          } else {
            // removed friends
            arr.push(props.reservations$, {
              kind: "REMOVE",
              entryUuid: reservation.entryUuid,
              uuid: reservation.uuid,
              name: reservation.name,
              timestamp: getCurrentTimestamp(),
            });
          }
        }
      });
    }

    editable$.set(false);
  }

  function removeReservation(): void {
    reservations().forEach((reservation) => {
      arr.push(props.reservations$, {
        kind: "REMOVE",
        entryUuid: reservation.entryUuid,
        uuid: reservation.uuid,
        name: reservation.name,
        timestamp: getCurrentTimestamp(),
      });
    });
    names$.set("");
    editable$.set(false);
  }

  return (
    <>
      {editable$.get() ? (
        <SimpleBox type="success" style={`grid-row: span ${props.rows}`}>
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <h5>Meine Reservation</h5>
            <form
              novalidate={true}
              onSubmit={(e) => {
                e.preventDefault();
                updateReservation(
                  names$
                    .get()
                    .split(",")
                    .map((s) => s.trim())
                    .filter((s) => s.length > 0),
                );
              }}
            >
              <div
                style="display: grid; grid-template-columns: max-content 1fr; gap: 0;"
                class="input-button reservation-table"
              >
                <Button label="Mich, " kind="special" />
                <input
                  type="text"
                  style="border-color: var(--clr-special-9);"
                  value={names$.get()}
                  onInput={(e) => names$.set(e.target.value)}
                  placeholder="Begleitpersonen (separieren mit Kommas)"
                  name="namen"
                />
              </div>
              <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; justify-content: flex-end;">
                <ButtonWithIcon
                  icon="trash"
                  label="Reservation löschen"
                  kind="danger"
                  onClick={removeReservation}
                />
                <ButtonWithIcon
                  icon="rotate-left"
                  label="Änderungen verwerfen"
                  kind="special"
                  onClick={() => names$.set(getFriendNames())}
                />
                <ButtonWithIcon
                  icon="floppy-disk-circle-arrow-right"
                  label={
                    names$.get().trim().length === 0
                      ? "Mich anmelden"
                      : `Uns (${
                          names$
                            .get()
                            .split(",")
                            .filter((s) => s.trim().length > 0).length + 1
                        }) anmelden`
                  }
                  kind="success"
                  type="submit"
                />
              </div>
            </form>
          </div>
        </SimpleBox>
      ) : (
        <Show
          when={reservations().length > 0}
          fallback={
            <ButtonWithIcon
              icon="person-to-portal"
              label="Plätze reservieren"
              kind="success"
              onClick={() => editable$.set(true)}
            />
          }
        >
          <SimpleBox type="success" style={`grid-row: span ${props.rows}`}>
            <div class="reservation-table-entry">
              <p>
                Reserviert für{" "}
                {join(
                  [
                    "mich",
                    getFriendNames()
                      .split(",")
                      .map((s) => s.trim()),
                  ]
                    .flat()
                    .filter((n) => n.trim().length > 0),
                  ", ",
                  " und ",
                )}
              </p>
              <IconOnlyButton
                icon="pencil"
                onClick={() => {
                  names$.set(getFriendNames());
                  editable$.set(true);
                }}
              />
            </div>
          </SimpleBox>
        </Show>
      )}
    </>
  );
}

export function Reservation(props: {
  reservations$: Reactive<ReserveAction[]>;
  entry: ProgramPublicEntry;
  myReservations: ReserveAction[];
  addReservation: (reservation: ReserveAction) => void;
  removeReservation: (reservationUuid: ReservationUuid) => void;
  roles: Roles;
  secret: RegistrationUuid;
  isEditable: boolean;
}): JSX.Element {
  const view = () =>
    prepareRegistrationView({
      programEntry: props.entry,
      roles: props.roles,
      secret: props.secret,
    });
  console.log(view());

  const myReservations = () =>
    props.myReservations.filter(
      (r) => r.entryUuid === props.entry.timeSlot.uuid,
    );

  const hasReservedForThemselves = (): boolean => {
    return myReservations().some((r) => r.name.kind === "SELF");
  };

  const range = () => {
    return toRange(props.entry.participation.seats.max).map((i) => {
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

  return (
    <>
      <div class="reservation-table">
        <div class="count"></div>
        <h5 style="border-block-start: 2px solid currentColor; color: var(--clr-success-11); padding-block-start: 0.5rem;">
          Reservationen
        </h5>
        <For
          each={view()}
          fallback={<em>Teilnahme ohne Anmeldung möglich.</em>}
        >
          {(seat) => (
            <>
              <div class="count">{seat.seatNumber}</div>
              <Switch fallback={<code>NOT IMPLEMENTED YET {seat.kind}</code>}>
                <Match when={seat.kind === "RESERVATION_FORM"}>
                  <ReservationForm
                    reservations$={props.reservations$}
                    timeslotUuid={props.entry.timeSlot.uuid}
                    rows={seat.rows}
                  />
                </Match>
                <Match when={seat.kind === "OVERFLOW"}>
                  <>{/* leave empty */}</>
                </Match>
                <Match
                  when={seat.kind === "RESERVED_OTHER" && !seat.waitingList}
                >
                  <Box style={`grid-row: span ${seat.rows}`}>
                    Bereits reserviert{" "}
                    {"names" in seat && seat.names !== null
                      ? `(${seat.names.join(", ")})`
                      : ""}
                  </Box>
                </Match>
                <Match
                  when={seat.kind === "RESERVED_OTHER" && seat.waitingList}
                >
                  <Box style={`grid-row: span ${seat.rows}`}>
                    Auf der Warteliste{" "}
                    {"names" in seat && seat.names !== null
                      ? `(${seat.names.join(", ")})`
                      : ""}
                  </Box>
                </Match>
                <Match when={seat.kind === "NOT_RESERVED"}>
                  <Box>Freier Platz</Box>
                </Match>
                <Match when={seat.kind === "RESERVED_SPONTANIOUS"}>
                  <Box>
                    <em>Reserviert für Spontane</em>
                  </Box>
                </Match>
                <Match when={seat.kind === "WAITING_LIST_START"}>
                  <h5 style="border-block-start: 2px solid currentColor; color: var(--clr-danger-11); padding-block-start: 0.5rem; margin-block-start: 0.5rem; margin-block-end: -0.5rem;">
                    Warteliste
                  </h5>
                </Match>
              </Switch>
            </>
          )}
        </For>
      </div>
      <Show when={false}>
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
                    <Match when={seat.kind === "RESERVED_OTHER_WITH_NAME"}>
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
                                  : unsafeToReservationUuid(
                                      "should not happen",
                                    ),
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
                                  : unsafeToReservationUuid(
                                      "should not happen",
                                    ),
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
                            kind: "ADD",
                            entryUuid: props.entry.timeSlot.uuid,
                            uuid: unsafeToReservationUuid(crypto.randomUUID()),
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
                            kind: "ADD",
                            entryUuid: props.entry.timeSlot.uuid,
                            timestamp: getCurrentTimestamp(),
                            name: {
                              kind: "FRIEND",
                              friendsName: name,
                            },
                            uuid: unsafeToReservationUuid(crypto.randomUUID()),
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
      </Show>
    </>
  );
}

type ReservationView = { seatNumber: number | null; rows: number } & (
  | {
      kind: "RESERVED_OTHER";
      names: string[] | null;
      waitingList: boolean;
    }
  | {
      kind: "OVERFLOW";
    }
  | {
      kind: "NOT_RESERVED";
    }
  | { kind: "RESERVATION_FORM" }
  | { kind: "RESERVED_SPONTANIOUS" }
  | { kind: "WAITING_LIST_START" }
);

function prepareRegistrationView(props: {
  programEntry: ProgramPublicEntry;
  secret: RegistrationUuid;
  roles: Roles;
}): ReservationView[] {
  const view: ReservationView[] = [];

  let seatNumberCounter = 1;

  const allowedDetails =
    props.roles.includes("admin") || props.programEntry.myEntry;

  const ordered = orderReservations(props.programEntry);
  console.log(ordered);

  const alreadyReserved = ordered.some((entry) =>
    props.secret.startsWith(entry.groupId),
  );

  function addViews(groups: GroupedReservation[], waitingList: boolean): void {
    groups.forEach((group) => {
      const myReservation = props.secret.startsWith(group.groupId);

      toRange(group.seats).forEach((groupMemberIndex) => {
        if (allowedDetails) {
          if (groupMemberIndex === 0) {
            if (myReservation) {
              view.push({
                kind: "RESERVATION_FORM",
                rows: group.seats,
                seatNumber: seatNumberCounter++,
              });
            } else {
              view.push({
                kind: "RESERVED_OTHER",
                names: group.names,
                waitingList,
                rows: group.seats,
                seatNumber: seatNumberCounter++,
              });
            }
          } else {
            view.push({
              kind: "OVERFLOW",
              rows: 1,
              seatNumber: seatNumberCounter++,
            });
          }
        } else {
          if (myReservation) {
            if (groupMemberIndex === 0) {
              view.push({
                kind: "RESERVATION_FORM",
                rows: group.seats,
                seatNumber: seatNumberCounter++,
              });
            } else {
              view.push({
                kind: "OVERFLOW",
                rows: 1,
                seatNumber: seatNumberCounter++,
              });
            }
          } else {
            view.push({
              kind: "RESERVED_OTHER",
              names: null,
              waitingList,
              rows: 1,
              seatNumber: seatNumberCounter++,
            });
          }
        }
      });
    });
  }

  addViews(
    ordered.filter((group) => !group.waitinglist),
    false,
  );

  const emptySeats = Math.max(
    0,
    props.programEntry.participation.seats.max - view.length,
  );

  toRange(emptySeats).forEach((i) => {
    if (i + 1 === emptySeats) {
      view.push({
        kind: "RESERVED_SPONTANIOUS",
        rows: 1,
        seatNumber: seatNumberCounter++,
      });
    } else if (i === 0 && !alreadyReserved) {
      view.push({
        kind: "RESERVATION_FORM",
        rows: 1,
        seatNumber: seatNumberCounter++,
      });
    } else {
      view.push({
        kind: "NOT_RESERVED",
        rows: 1,
        seatNumber: seatNumberCounter++,
      });
    }
  });

  view.push({
    kind: "WAITING_LIST_START",
    rows: 1,
    seatNumber: null,
  });

  addViews(
    ordered.filter((group) => group.waitinglist),
    true,
  );

  return view;
}
