import { createSignal, type JSX } from "solid-js";
import type {
  ProgramByHour,
  ProgramEntryExtended,
  ReservationFromServer,
  UpdateSave,
} from "./data";
import { Checkbox } from "@common/components/Checkbox";
import type { Reservation, ReservationView } from "./types";

const BUFFER_SEATS = 1 as const;

function ProgrammEntryCard(props: {
  entry: ProgramEntryExtended;
  selfName: string;
  confirmedReservations: ReservationFromServer[];
  tentativeReservations: Reservation[];
  markedForDeletionReservations: number[];
  addTentativeReservation: (reservation: Reservation) => void;
  deleteReservation: (reservation: ReservationView) => void;
}): JSX.Element {
  function myReservations(): (ReservationView & {
    markedForDeletion: boolean;
  })[] {
    return [
      ...props.confirmedReservations.map(
        (reservation) =>
          ({
            name: reservation.spielerName ?? props.selfName,
            confirmed: true,
            gameUuid: props.entry.uuid,
            reservationId: reservation.id,
            markedForDeletion: props.markedForDeletionReservations.includes(
              reservation.id,
            ),
          }) satisfies ReservationView & { markedForDeletion: boolean },
      ),
      ...props.tentativeReservations.map(
        (reservation) =>
          ({
            name: reservation.friendsName ?? props.selfName,
            confirmed: false,
            gameUuid: props.entry.uuid,
            markedForDeletion: false,
          }) satisfies ReservationView & { markedForDeletion: false },
      ),
    ];
  }

  function openSeats(): number {
    const myConfirmedReservationIds = props.confirmedReservations.map(
      (reservation) => reservation.id,
    );
    const thirdPartyReservations = props.entry.reservedIds.filter(
      (id) => !myConfirmedReservationIds.includes(id),
    );

    return (
      props.entry.playerCount.max -
      BUFFER_SEATS -
      thirdPartyReservations.length -
      myReservations().filter((reservation) => !reservation.markedForDeletion)
        .length
    );
  }

  return (
    <>
      <li
        class={`event-entry ${myReservations().filter((reservation) => !reservation.markedForDeletion).length > 0 ? "success" : openSeats() > 0 ? "special" : "gray"}`}
      >
        <h1 class="event-title">
          {props.entry.title === null
            ? props.entry.system
            : `${props.entry.title} (${props.entry.system})`}
        </h1>
        <div class="event-details">
          <div class="event-tags">
            <strong>Zeit:</strong> {props.entry.slot.start} -{" "}
            {props.entry.slot.end} Uhr
          </div>
          <div class="event-tags">
            <strong>Spielleitung:</strong> {props.entry.master.first}{" "}
            {props.entry.master.last}
          </div>
          <div class="event-tags">
            <strong>Freie Plätze:</strong>{" "}
            {openSeats() > 1 ? (
              <span>
                Es hat noch <strong>{openSeats()} Plätze</strong> frei.
              </span>
            ) : openSeats() === 1 ? (
              <span>
                Es hat noch <strong>{openSeats()} Platz</strong> frei.
              </span>
            ) : (
              "Diese Spielrunde ist bereits voll besetzt."
            )}
          </div>
        </div>
        <div class="event-description">
          {props.entry.description !== null &&
          props.entry.description.trim().length > 0 ? (
            <div class="event-description content">
              <p>
                <strong>Beschreibung:</strong>
                <br />
                {props.entry.description}
              </p>
            </div>
          ) : null}
          {myReservations().length > 0 ? (
            <div>
              <p>
                <strong>Deine Reservationen</strong>
              </p>
              <ul>
                {myReservations().map((reservation) => (
                  <li style="font-size: 0.83rem;">
                    {reservation.markedForDeletion ? (
                      <>
                        <s>{reservation.name}</s>
                        <span title="ungespeicherte Änderung"> *</span>
                      </>
                    ) : (
                      <>
                        {reservation.name}
                        {reservation.confirmed ? null : (
                          <span title="ungespeicherte Änderung"> *</span>
                        )}
                        <a
                          href="javascript:;"
                          style="border: none;"
                          title="Reservation löschen"
                          onClick={() => props.deleteReservation(reservation)}
                        >
                          <i class="fa-duotone fa-circle-xmark"></i>
                        </a>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
        {openSeats() > 0 ? (
          myReservations().length === 0 ? (
            <ul role="list" class="event-links">
              <li>
                <a
                  class="event-link"
                  href="javascript:;"
                  onClick={() =>
                    props.addTentativeReservation({
                      gameUuid: props.entry.uuid,
                      friendsName: null,
                    })
                  }
                >
                  + Platz für mich reservieren
                </a>
              </li>
            </ul>
          ) : (
            <ul role="list" class="event-links">
              <li>
                <a
                  class="event-link"
                  href="javascript:;"
                  onClick={() => {
                    const friendsName = prompt(
                      "Bitte teile uns mit, wie deine Begleitung heisst:",
                    );
                    if (friendsName !== null && friendsName.trim().length > 0) {
                      props.addTentativeReservation({
                        gameUuid: props.entry.uuid,
                        friendsName,
                      });
                    }
                  }}
                >
                  + Platz für Begleitung reservieren
                </a>
              </li>
            </ul>
          )
        ) : null}
      </li>
    </>
  );
}

export function ProgramOfDay(props: {
  selfName: string;
  programByHour: ProgramByHour;
  wantsEmailUpdates: boolean;
  confirmedReservations: ReservationFromServer[];
  tentativeReservations: Reservation[];
  markedForDeletionReservations: number[];
  addTentativeReservation: (reservation: Reservation) => void;
  updateSave: UpdateSave;
  deleteReservation: (reservation: ReservationView) => void;
}): JSX.Element {
  const [filter, setFilter] = createSignal<string[]>([]);
  function toggleFilter(hour: string): void {
    setFilter((prev) => {
      if (prev.includes(hour)) {
        return prev.filter((f) => f !== hour);
      }
      return [...prev, hour];
    });
  }

  return (
    <>
      <style>
        {`
          .event-filters .active {
            color: var(--clr-success-10) !important;
          }
        `}
      </style>
      <div class="content">
        <small>
          Auf dieser Seite kannst du dich und deine Freunde für Spielrunden
          einschreiben, solange es freie Plätze hat.
        </small>
      </div>
      <br />
      <Checkbox
        checked={props.wantsEmailUpdates}
        onValueUpdate={(value) => props.updateSave("wantsEmailUpdates", value)}
        label="Ja, ich möchte gerne Updates erhalten, wenn neue Spielrunden aufgeschalten werden."
        name="wantsUpdates"
        value="true"
      />
      <br />
      <div class="event-filters">
        <h2>Filter</h2>
        <ul role="list">
          <li>
            <a
              href="javascript:;"
              class={filter().length === 0 ? "active" : ""}
              onClick={() => setFilter([])}
            >
              Alle
            </a>
          </li>
          {props.programByHour.map(([hour, _]) => (
            <li>
              <a
                href="javascript:;"
                class={filter().includes(hour) ? "active" : ""}
                onClick={() => toggleFilter(hour)}
              >
                {hour} Uhr
              </a>
            </li>
          ))}
        </ul>
      </div>
      {props.programByHour
        .filter(([hour]) => filter().includes(hour) || filter().length === 0)
        .map(([hour, entries]) => (
          <>
            <h3 style="margin-block: 1rem;">Start {hour} Uhr</h3>
            <ul class="event-list" role="list">
              {entries.map((entry) => (
                <ProgrammEntryCard
                  entry={entry}
                  selfName={props.selfName}
                  confirmedReservations={props.confirmedReservations.filter(
                    (reservation) => reservation.game === entry.uuid,
                  )}
                  tentativeReservations={props.tentativeReservations.filter(
                    (reservation) => reservation.gameUuid === entry.uuid,
                  )}
                  markedForDeletionReservations={
                    props.markedForDeletionReservations
                  }
                  addTentativeReservation={props.addTentativeReservation}
                  deleteReservation={props.deleteReservation}
                />
              ))}
            </ul>
          </>
        ))}
    </>
  );
}
