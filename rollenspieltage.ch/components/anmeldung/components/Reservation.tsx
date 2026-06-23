import {
  unsafeToReservationUuid,
  type RegistrationUuid,
  type ReservationUuid,
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
import {
  orderReservations,
  type GroupedReservation,
} from "@rst/components/anmeldung/utils/waitinglist";
import type { Roles } from "@rst/components/anmeldung/api/meta";
import { assert } from "@common/components/utils";

export function ReservationForm(props: {
  entry: ProgramPublicEntry;
  addReservationAction: (action: ReserveAction) => void;
  rows: number;
  selfReservationUuid: ReservationUuid | null;
  secret: string;
  waitingList: boolean;
}): JSX.Element {
  const list = () =>
    props.waitingList
      ? props.entry.participation.waiting
      : props.entry.participation.reserved;

  const reservations = () =>
    list()
      .filter((entry) => props.secret.startsWith(entry.groupId))
      .map((entry) => {
        assert(entry.name !== null, "Should have names of all owned entries!");
        return {
          ...entry,
          name: entry.name,
        };
      });

  function getFriendNames(): string {
    return reservations()
      .filter((r) => r.uuid !== props.selfReservationUuid)
      .map((r) => r.name)
      .filter((r) => r !== null)
      .join(", ");
  }

  const emptySeatsIgnoringSelfGroup = () =>
    props.entry.participation.seats.max -
    props.entry.participation.reserved.filter(
      (entry) => !props.secret.startsWith(entry.groupId),
    ).length -
    1;

  const names$ = createReactive(getFriendNames());
  const editable$ = createReactive(false);

  function registrationLabel(): string {
    if (names$.get().trim().length === 0) {
      // without friends
      return emptySeatsIgnoringSelfGroup() > 0
        ? "Mich anmelden"
        : "Mich in Warteliste eintragen";
    } else {
      // with friends
      const friendsCount = names$
        .get()
        .split(",")
        .filter((s) => s.trim().length > 0).length;
      return emptySeatsIgnoringSelfGroup() > friendsCount
        ? `Uns (${friendsCount + 1}) anmelden`
        : `Uns (${friendsCount + 1}) in Warteliste eintragen`;
    }
  }

  function updateReservation(names: string[]): void {
    if (reservations().length === 0) {
      // new reservation
      props.addReservationAction({
        kind: "ADD",
        waitinglistPreferences: "EXACTLY",
        entryUuid: props.entry.timeSlot.uuid,
        uuid: unsafeToReservationUuid(crypto.randomUUID()),
        timestamp: getCurrentTimestamp(),
        name: {
          kind: "SELF",
        },
      });

      names.forEach((name) => {
        props.addReservationAction({
          kind: "ADD",
          waitinglistPreferences: "EXACTLY",
          entryUuid: props.entry.timeSlot.uuid,
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
          props.addReservationAction({
            waitinglistPreferences: "EXACTLY",
            kind: "ADD",
            entryUuid: props.entry.timeSlot.uuid,
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
          // skip
        } else {
          const friendsName = names[i - 1];
          if (friendsName !== undefined) {
            props.addReservationAction({
              kind: "UPDATE",
              waitinglistPreferences: "EXACTLY",
              entryUuid: props.entry.timeSlot.uuid,
              uuid: reservation.uuid,
              name: { kind: "FRIEND", friendsName },
              timestamp: getCurrentTimestamp(),
            });
          } else {
            // removed friends
            props.addReservationAction({
              kind: "REMOVE",
              waitinglistPreferences: "EXACTLY",
              entryUuid: props.entry.timeSlot.uuid,
              uuid: reservation.uuid,
              name: { kind: "FRIEND", friendsName: "---removed---" },
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
      props.addReservationAction({
        kind: "REMOVE",
        waitinglistPreferences: "EXACTLY",
        entryUuid: props.entry.timeSlot.uuid,
        uuid: reservation.uuid,
        name: { kind: "FRIEND", friendsName: "---removed---" },
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
                <Button label="Ich, " kind="special" />
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
                  label="Abbrechen"
                  kind="special"
                  onClick={() => {
                    names$.set(getFriendNames());
                    editable$.set(false);
                  }}
                />
                <ButtonWithIcon
                  icon="floppy-disk-circle-arrow-right"
                  label={registrationLabel()}
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
              label={
                props.waitingList
                  ? "In Warteliste eintragen"
                  : "Plätze reservieren"
              }
              kind="success"
              onClick={() => editable$.set(true)}
            />
          }
        >
          <SimpleBox type="success" style={`grid-row: span ${props.rows}`}>
            <div class="reservation-table-entry">
              <p>
                {props.waitingList ? "Auf der Warteliste: " : "Reserviert für "}
                {join(
                  [props.waitingList ? "Ich" : "mich"].concat(
                    getFriendNames()
                      .split(",")
                      .map((s) => s.trim())
                      .filter((n) => n.trim().length > 0),
                  ),
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

  return (
    <>
      <div class="reservation-table">
        <div class="count"></div>
        <h5 style="border-block-start: 2px solid currentColor; color: var(--clr-success-11); padding-block-start: 0.5rem; max-inline-size: 100%;">
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
                    entry={props.entry}
                    addReservationAction={(reservationAction) =>
                      arr.push(props.reservations$, reservationAction)
                    }
                    selfReservationUuid={
                      props.reservations$
                        .get()
                        .findLast(
                          (entry) =>
                            entry.name.kind === "SELF" &&
                            entry.entryUuid === props.entry.timeSlot.uuid,
                        )?.uuid ?? null
                    }
                    rows={seat.rows}
                    secret={props.secret}
                    waitingList={seat.waitingList}
                  />
                </Match>
                <Match when={seat.kind === "OVERFLOW"}>
                  <>{/* leave empty */}</>
                </Match>
                <Match
                  when={seat.kind === "RESERVED_OTHER" && !seat.waitingList}
                >
                  <Box style={`grid-row: span ${seat.rows}; opacity: 0.5;`}>
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
                  <h5 style="border-block-start: 2px solid currentColor; color: var(--clr-danger-11); padding-block-start: 0.5rem; margin-block-start: 0.5rem; margin-block-end: -0.5rem; max-inline-size: 100%;">
                    Warteliste
                  </h5>
                </Match>
              </Switch>
            </>
          )}
        </For>
      </div>
    </>
  );
}

type ReservationView = {
  seatNumber: number | null;
  rows: number;
  waitingList: boolean;
} & (
  | {
      kind: "RESERVED_OTHER";
      names: string[] | null;
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

  const { reserved, waiting } = orderReservations(props.programEntry);

  const alreadyReserved = [...reserved, ...waiting].some((entry) =>
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
                waitingList,
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
              waitingList,
            });
          }
        } else {
          if (myReservation) {
            if (groupMemberIndex === 0) {
              view.push({
                kind: "RESERVATION_FORM",
                rows: group.seats,
                seatNumber: seatNumberCounter++,
                waitingList,
              });
            } else {
              view.push({
                kind: "OVERFLOW",
                rows: 1,
                seatNumber: seatNumberCounter++,
                waitingList,
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

  addViews(reserved, false);

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
        waitingList: false,
      });
    } else if (i === 0 && !alreadyReserved) {
      view.push({
        kind: "RESERVATION_FORM",
        rows: 1,
        seatNumber: seatNumberCounter++,
        waitingList: false,
      });
    } else {
      view.push({
        kind: "NOT_RESERVED",
        rows: 1,
        seatNumber: seatNumberCounter++,
        waitingList: false,
      });
    }
  });

  if (waiting.length > 0) {
    view.push({
      kind: "WAITING_LIST_START",
      rows: 1,
      seatNumber: null,
      waitingList: true,
    });

    addViews(waiting, true);
  }

  if (!view.some((e) => e.kind === "RESERVATION_FORM")) {
    view.push({
      kind: "WAITING_LIST_START",
      rows: 1,
      seatNumber: null,
      waitingList: true,
    });
    view.push({
      kind: "RESERVATION_FORM",
      rows: 1,
      seatNumber: seatNumberCounter++,
      waitingList: true,
    });
  }

  return view;
}
