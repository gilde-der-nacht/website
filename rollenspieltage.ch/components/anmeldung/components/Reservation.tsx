import { unsafeToReservationUuid, type TimeslotUuid } from "@common/utils/ids";
import { Show, type JSX } from "solid-js";
import type { Participating } from "@rst/components/anmeldung/api/save";
import { arr, createReactive, type Reactive } from "@common/utils/reactivity";
import { SimpleBox } from "@common/components/Box";
import {
  Button,
  ButtonWithIcon,
  IconOnlyButton,
} from "@common/components/Button";
import { join } from "@common/utils/strings";
import { getCurrentTimestamp } from "@common/utils/shared";

export function Reservation(props: {
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
        console.log(reservations().length);
        if (i + 2 > reservations().length) {
          // added more friends
          console.log("add friend", name);
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
          console.log("update self");
          arr.update(props.reservations$, (r) => r.uuid === reservation.uuid, {
            ...reservation,
            name: {
              kind: "SELF",
            },
          });
        } else {
          const friendsName = names[i - 1];
          if (friendsName !== undefined) {
            console.log("update friend", friendsName);
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
            console.log("remove friend");
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
