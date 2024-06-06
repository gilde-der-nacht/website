import { createSignal, type JSX } from "solid-js";
import type {
  ProgramByHour,
  ProgramEntryExtended,
  ReservationFromServer,
  UpdateSave,
} from "./data";
import type { Reservation } from "./store";
import { Checkbox } from "@common/components/Checkbox";

const BUFFER_SEATS = 1 as const;

function ProgrammEntryCard(props: {
  entry: ProgramEntryExtended;
  selfName: string;
  confirmedReservations: ReservationFromServer[];
  tentativeReservations: Reservation[];
  addTentativeReservation: (reservation: Reservation) => void;
}): JSX.Element {
  const myReservations: { confirmed: boolean; name: string }[] = [
    ...props.confirmedReservations.map((reservation) => ({
      name: reservation.spielerName ?? props.selfName,
      confirmed: true,
    })),
    ...props.tentativeReservations.map((reservation) => ({
      name: reservation.friendsName ?? props.selfName,
      confirmed: false,
    })),
  ];
  const myConfirmedReservationIds = props.confirmedReservations.map(
    (reservation) => reservation.id,
  );
  const thirdPartyReservations = props.entry.reservedIds.filter(
    (id) => !myConfirmedReservationIds.includes(id),
  );
  const openSeats =
    props.entry.playerCount.max -
    BUFFER_SEATS -
    thirdPartyReservations.length -
    myReservations.length;

  return (
    <li
      class={`event-entry ${myReservations.length > 0 ? "success" : openSeats > 0 ? "special" : "gray"}`}
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
          {openSeats > 1 ? (
            <span>
              Es hat noch <strong>{openSeats} Plätze</strong> frei.
            </span>
          ) : openSeats === 1 ? (
            <span>
              Es hat noch <strong>{openSeats} Platz</strong> frei.
            </span>
          ) : (
            "Diese Spielrunde ist bereits voll besetzt."
          )}
        </div>
        {myReservations.length > 0 ? (
          <div class="event-tags">
            <strong>Reserviert für:</strong>{" "}
            {myReservations
              .map(
                (reservation) =>
                  `${reservation.name}${reservation.confirmed ? "" : "*"}`,
              )
              .join(", ")}
          </div>
        ) : null}
      </div>
      {props.entry.description !== null &&
      props.entry.description.trim().length > 0 ? (
        <div class="event-description content">
          <p>
            <strong>Beschreibung:</strong>
            <br />
            {props.entry.description}
          </p>
        </div>
      ) : (
        <div></div>
      )}
      {openSeats > 0 ? (
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
              + Platz reservieren
            </a>
          </li>
        </ul>
      ) : null}
    </li>
  );
}

const ALL_FILTER_LABEL = "ALL" as const;

export function ProgramOfDay(props: {
  selfName: string;
  programByHour: ProgramByHour;
  wantsEmailUpdates: boolean;
  confirmedReservations: ReservationFromServer[];
  tentativeReservations: Reservation[];
  addTentativeReservation: (reservation: Reservation) => void;
  updateSave: UpdateSave;
}): JSX.Element {
  const [filter, setFilter] = createSignal<string>(ALL_FILTER_LABEL);

  return (
    <>
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
              class={filter() === ALL_FILTER_LABEL ? "active" : ""}
              onClick={() => setFilter(ALL_FILTER_LABEL)}
            >
              Alle
            </a>
          </li>
          {props.programByHour.map(([hour, _]) => (
            <li>
              <a
                href="javascript:;"
                class={filter() === hour ? "active" : ""}
                onClick={() => setFilter(hour)}
              >
                {hour} Uhr
              </a>
            </li>
          ))}
        </ul>
      </div>
      {props.programByHour
        .filter(([hour]) => hour === filter() || ALL_FILTER_LABEL === filter())
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
                  addTentativeReservation={props.addTentativeReservation}
                />
              ))}
            </ul>
          </>
        ))}
    </>
  );
}
