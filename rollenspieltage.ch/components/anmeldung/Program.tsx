import { createSignal, type JSX } from "solid-js";
import type { ProgramByHour, ProgramEntryExtended } from "./data";
import type { TentativeReservation } from "./store";

function ProgrammEntryCard(props: {
  entry: ProgramEntryExtended;
  addTentativeReservation: (reservation: TentativeReservation) => void;
}): JSX.Element {
  return (
    <li class="event-entry gray">
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
    </li>
  );
}

const ALL_FILTER_LABEL = "ALL" as const;

export function ProgramOfDay(props: {
  programByHour: ProgramByHour;
  addTentativeReservation: (reservation: TentativeReservation) => void;
}): JSX.Element {
  const [filter, setFilter] = createSignal<string>(ALL_FILTER_LABEL);

  return (
    <>
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
                  addTentativeReservation={props.addTentativeReservation}
                />
              ))}
            </ul>
          </>
        ))}
    </>
  );
}
