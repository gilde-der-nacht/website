import {
  unsafeToReservationUuid,
  type ReservationUuid,
  type TimeslotUuid,
} from "@common/utils/ids";
import { For, Match, Show, Switch, type JSX } from "solid-js";
import type { Participating } from "@rst/components/anmeldung/api/save";
import { arr, createReactive, type Reactive } from "@common/utils/reactivity";
import { Box, SimpleBox } from "@common/components/Box";
import {
  Button,
  ButtonWithIcon,
  IconOnlyButton,
} from "@common/components/Button";
import { join } from "@common/utils/strings";
import { getCurrentTimestamp } from "@common/utils/shared";
import type { ProgramPublicEntry } from "../api/program";
import { toRange } from "@common/utils/time";
import { InputButton } from "@common/components/InputButton";

export function ReservationForm(props: {
  timeslotUuid: TimeslotUuid;
  reservations$: Reactive<Participating[]>;
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
        entryUuid: props.timeslotUuid,
        uuid: unsafeToReservationUuid(crypto.randomUUID()),
        timestamp: getCurrentTimestamp(),
        name: {
          kind: "SELF",
        },
      });
      names.forEach((name) => {
        arr.push(props.reservations$, {
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
          arr.update(props.reservations$, (r) => r.uuid === reservation.uuid, {
            ...reservation,
            name: {
              kind: "SELF",
            },
          });
        } else {
          const friendsName = names[i - 1];
          if (friendsName !== undefined) {
            arr.update(
              props.reservations$,
              (r) => r.uuid === reservation.uuid,
              {
                ...reservation,
                name: {
                  kind: "FRIEND",
                  friendsName,
                },
              },
            );
          } else {
            // removed friends
            arr.remove(props.reservations$, (r) => r.uuid === reservation.uuid);
          }
        }
      });
    }

    editable$.set(false);
  }

  function removeReservation(): void {
    reservations().forEach((reservation) =>
      arr.remove(props.reservations$, (r) => r.uuid === reservation.uuid),
    );
    names$.set("");
    editable$.set(false);
  }

  return (
    <>
      {editable$.get() ? (
        <SimpleBox type="success">
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
          <SimpleBox type="success">
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
  reservations$: Reactive<Participating[]>;
  entry: ProgramPublicEntry;
  myReservations: Participating[];
  addReservation: (reservation: Participating) => void;
  removeReservation: (reservationUuid: ReservationUuid) => void;
  isEditable: boolean;
}): JSX.Element {
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
      <ReservationForm
        reservations$={props.reservations$}
        timeslotUuid={props.entry.timeSlot.uuid}
      />
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
                                : unsafeToReservationUuid("should not happen"),
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
                                : unsafeToReservationUuid("should not happen"),
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
    </>
  );
}
