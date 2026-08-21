import {
  unsafeToReservationUuid,
  type RegistrationUuid,
  type ReservationUuid,
} from "@common/utils/ids";
import { For, Match, Show, Switch, type Accessor, type JSX } from "solid-js";
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
import type {
  ProgramPublicEntry,
  ReservationEntry,
} from "@rst/components/anmeldung/api/program";
import { toRange } from "@common/utils/time";
import {
  orderReservations,
  type GroupedReservation,
} from "@rst/components/anmeldung/utils/waitinglist";
import type { Roles } from "@rst/components/anmeldung/api/meta";
import { assert } from "@common/components/utils";
import { LoadingOverlay } from "@rst/components/anmeldung/components/Loading";

const PREFERENCES = {
  EXACTLY: "für exakt diese Spielrunde",
  SIMILAR: "für eine ähnliche Spielrunde",
  ANYTHING: "für irgendeine Spielrunde in diesem Zeitraum",
};

function getPreferenceLabel(
  reservations: {
    waitinglistPreferences: "EXACTLY" | "SIMILAR" | "ANYTHING";
  }[],
): string {
  const lastEntry = reservations.at(-1);
  return PREFERENCES[lastEntry?.waitinglistPreferences ?? "EXACTLY"];
}

export function ReservationForm(props: {
  entry: ProgramPublicEntry;
  addReservationAction: (action: ReserveAction) => void;
  rows: number;
  selfReservationUuid: ReservationUuid | null;
  secret: string;
  waitingList: boolean;
  isEditable: boolean;
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

  const names$ = createReactive(getFriendNames());
  const editable$ = createReactive(false);

  return (
    <>
      {editable$.get() ? (
        <ReservationEdit
          names$={names$}
          editable$={editable$}
          entry={props.entry}
          getFriendNames={getFriendNames}
          addReservationAction={props.addReservationAction}
          reservations={reservations}
          rows={props.rows}
          secret={props.secret}
        />
      ) : (
        <ReservationView
          names$={names$}
          editable$={editable$}
          reservations={reservations}
          getFriendNames={getFriendNames}
          waitingList={props.waitingList}
          rows={props.rows}
          isEditable={props.isEditable}
        />
      )}
    </>
  );
}

function ReservationEdit(props: {
  names$: Reactive<string>;
  editable$: Reactive<boolean>;
  getFriendNames: Accessor<string>;
  entry: ProgramPublicEntry;
  reservations: Accessor<ReservationEntry[]>;
  addReservationAction: (action: ReserveAction) => void;
  rows: number;
  secret: string;
}): JSX.Element {
  const waitlistPreferenceShown$ = createReactive(false);

  function emptySeatsIgnoringSelfGroup(): number {
    return (
      props.entry.participation.seats.max -
      props.entry.participation.reserved.filter(
        (entry) => !props.secret.startsWith(entry.groupId),
      ).length -
      1
    );
  }

  function willReservationGoToWaitinglist(): boolean {
    const friendsCount = props.names$
      .get()
      .split(",")
      .filter((s) => s.trim().length > 0).length;
    return emptySeatsIgnoringSelfGroup() <= friendsCount;
  }

  function registrationLabel(): string {
    const friendsCount = props.names$
      .get()
      .split(",")
      .filter((s) => s.trim().length > 0).length;

    if (friendsCount === 0) {
      // without friends
      return willReservationGoToWaitinglist()
        ? "Mich in Warteliste eintragen ..."
        : "Mich anmelden";
    } else {
      // with friends
      return willReservationGoToWaitinglist()
        ? `Uns (${friendsCount + 1}) in Warteliste eintragen ...`
        : `Uns (${friendsCount + 1}) anmelden`;
    }
  }

  function updateReservation(
    names: string[],
    preferences: "EXACTLY" | "SIMILAR" | "ANYTHING",
  ): void {
    if (props.reservations().length === 0) {
      // new reservation
      props.addReservationAction({
        kind: "ADD",
        waitinglistPreferences: preferences,
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
          waitinglistPreferences: preferences,
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
        if (i + 2 > props.reservations().length) {
          // added more friends
          props.addReservationAction({
            waitinglistPreferences: preferences,
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
      props.reservations().forEach((reservation, i) => {
        if (i === 0) {
          props.addReservationAction({
            kind: "UPDATE",
            waitinglistPreferences: preferences,
            entryUuid: props.entry.timeSlot.uuid,
            uuid: reservation.uuid,
            name: { kind: "SELF" },
            timestamp: getCurrentTimestamp(),
          });
        } else {
          const friendsName = names[i - 1];
          if (friendsName !== undefined) {
            props.addReservationAction({
              kind: "UPDATE",
              waitinglistPreferences: preferences,
              entryUuid: props.entry.timeSlot.uuid,
              uuid: reservation.uuid,
              name: { kind: "FRIEND", friendsName },
              timestamp: getCurrentTimestamp(),
            });
          } else {
            // removed friends
            props.addReservationAction({
              kind: "REMOVE",
              waitinglistPreferences: preferences,
              entryUuid: props.entry.timeSlot.uuid,
              uuid: reservation.uuid,
              name: { kind: "FRIEND", friendsName: "---removed---" },
              timestamp: getCurrentTimestamp(),
            });
          }
        }
      });
    }

    props.editable$.set(false);
  }

  function removeReservation(): void {
    props.reservations().forEach((reservation) => {
      props.addReservationAction({
        kind: "REMOVE",
        waitinglistPreferences: "EXACTLY",
        entryUuid: props.entry.timeSlot.uuid,
        uuid: reservation.uuid,
        name: { kind: "FRIEND", friendsName: "---removed---" },
        timestamp: getCurrentTimestamp(),
      });
    });
    props.names$.set("");
    props.editable$.set(false);
  }

  return (
    <SimpleBox type="success" style={`grid-row: span ${props.rows}`}>
      <div style="display: flex; flex-direction: column; gap: 0.5rem;">
        <h5>Meine Reservation</h5>
        <form
          novalidate={true}
          onSubmit={(e) => {
            e.preventDefault();

            if (willReservationGoToWaitinglist()) {
              waitlistPreferenceShown$.set(true);
              return;
            }

            updateReservation(
              props.names$
                .get()
                .split(",")
                .map((s) => s.trim())
                .filter((s) => s.length > 0),
              "EXACTLY",
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
              value={props.names$.get()}
              onInput={(e) => props.names$.set(e.target.value)}
              placeholder="Begleitpersonen (separieren mit Kommas)"
              name="namen"
            />
          </div>
          <Show
            when={waitlistPreferenceShown$.get()}
            fallback={
              <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                <Show when={props.reservations().length > 0}>
                  <ButtonWithIcon
                    icon="trash"
                    label="Reservation löschen"
                    kind="danger"
                    onClick={removeReservation}
                  />
                </Show>
                <ButtonWithIcon
                  icon="rotate-left"
                  label="Abbrechen"
                  kind="special"
                  onClick={() => {
                    props.names$.set(props.getFriendNames());
                    props.editable$.set(false);
                  }}
                />
                <ButtonWithIcon
                  icon="floppy-disk-circle-arrow-right"
                  label={registrationLabel()}
                  kind={waitlistPreferenceShown$.get() ? "gray" : "success"}
                  type="submit"
                />
              </div>
            }
          >
            <h5>Warteliste-Präferenz:</h5>
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
              <ButtonWithIcon
                icon="gear"
                label={PREFERENCES["EXACTLY"]}
                kind="success"
                onClick={() => {
                  updateReservation(
                    props.names$
                      .get()
                      .split(",")
                      .map((s) => s.trim())
                      .filter((s) => s.length > 0),
                    "EXACTLY",
                  );
                }}
              />
              <ButtonWithIcon
                icon="gear"
                label={PREFERENCES["SIMILAR"]}
                kind="special"
                onClick={() => {
                  updateReservation(
                    props.names$
                      .get()
                      .split(",")
                      .map((s) => s.trim())
                      .filter((s) => s.length > 0),
                    "SIMILAR",
                  );
                }}
              />
              <ButtonWithIcon
                icon="gear"
                label={PREFERENCES["ANYTHING"]}
                kind="special"
                onClick={() => {
                  updateReservation(
                    props.names$
                      .get()
                      .split(",")
                      .map((s) => s.trim())
                      .filter((s) => s.length > 0),
                    "ANYTHING",
                  );
                }}
              />
              <ButtonWithIcon
                icon="rotate-left"
                label="Zurück"
                kind="special"
                onClick={() => waitlistPreferenceShown$.set(false)}
              />
            </div>
          </Show>
        </form>
      </div>
    </SimpleBox>
  );
}

function ReservationView(props: {
  names$: Reactive<string>;
  editable$: Reactive<boolean>;
  reservations: Accessor<ReservationEntry[]>;
  getFriendNames: Accessor<string>;
  waitingList: boolean;
  rows: number;
  isEditable: boolean;
}): JSX.Element {
  return (
    <Show
      when={props.reservations().length > 0}
      fallback={
        <Show
          when={props.isEditable}
          fallback={
            <Box>
              <em>Reserviert für Spontane</em>
            </Box>
          }
        >
          <ButtonWithIcon
            icon="person-to-portal"
            label={
              props.waitingList
                ? "In Warteliste eintragen"
                : "Plätze reservieren"
            }
            kind="success"
            onClick={() => props.editable$.set(true)}
          />
        </Show>
      }
    >
      <SimpleBox type="success" style={`grid-row: span ${props.rows}`}>
        <div class="reservation-table-entry">
          <p>
            {props.waitingList ? "Auf der Warteliste: " : "Reserviert für "}
            {join(
              [props.waitingList ? "Ich" : "mich"].concat(
                props
                  .getFriendNames()
                  .split(",")
                  .map((s) => s.trim())
                  .filter((n) => n.trim().length > 0),
              ),
              ", ",
              " und ",
            )}
            {props.waitingList ? (
              <>
                <br />
                Warteliste-Präferenz: {getPreferenceLabel(props.reservations())}
              </>
            ) : null}
          </p>
          <div>
            {props.isEditable ? (
              <IconOnlyButton
                icon="pencil"
                onClick={() => {
                  props.names$.set(props.getFriendNames());
                  props.editable$.set(true);
                }}
              />
            ) : null}
          </div>
        </div>
      </SimpleBox>
    </Show>
  );
}

export function Reservation(props: {
  reservations$: Reactive<ReserveAction[]>;
  showLoading$: Reactive<boolean>;
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
      <div
        class="reservation-table"
        style="position: relative; padding: 0.5rem;"
      >
        <Show when={props.showLoading$.get()}>
          <LoadingOverlay />
        </Show>
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
                    isEditable={props.isEditable}
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
                    <br />
                    Warteliste-Präferenz:{" "}
                    {getPreferenceLabel(props.myReservations)}
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
                  <h5 style="border-block-start: 2px solid currentColor; color: var(--clr-danger-11); padding-block-start: 0.5rem; margin-block-start: 0.5rem; margin-block-end: -0.5rem; max-inline-size: 100%; opacity: 0;">
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
