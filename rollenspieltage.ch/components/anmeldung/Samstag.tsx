import { getByDayAndHour, type Program, type ProgramByHour } from "./data";
import { Box } from "@common/components/Box";
import { createSignal, type JSX } from "solid-js";

const ALL_FILTER_LABEL = "ALL" as const;

export function ProgramOfDay(props: {
  programByHour: ProgramByHour;
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
              href="#"
              class={filter() === ALL_FILTER_LABEL ? "active" : ""}
              onClick={() => setFilter(ALL_FILTER_LABEL)}
            >
              Alle
            </a>
          </li>
          {props.programByHour.map(([hour, _]) => (
            <li>
              <a
                href="#"
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
                <li class="event-entry gray">
                  <h1 class="event-title">
                    {entry.title === null
                      ? entry.system
                      : `${entry.title} (${entry.system})`}
                  </h1>
                  <div class="event-details">
                    <div class="event-tags">
                      <strong>Zeit:</strong> {entry.slot.start} -{" "}
                      {entry.slot.end} Uhr
                    </div>
                    <div class="event-tags">
                      <strong>Spielleitung:</strong> {entry.master.first}{" "}
                      {entry.master.last}
                    </div>
                  </div>
                  {entry.description !== null &&
                  entry.description.trim().length > 0 ? (
                    <div class="event-description content">
                      <p>
                        <strong>Beschreibung:</strong>
                        <br />
                        {entry.description}
                      </p>{" "}
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          </>
        ))}
    </>
  );
}

export function Samstag(props: { program: Program | null }): JSX.Element {
  if (props.program === null) {
    return (
      <>
        <h2>Programm Samstag</h2>
        <Box>Programm wird geladen ...</Box>
      </>
    );
  }
  const saturdayByHour = getByDayAndHour("SATURDAY", props.program);
  return (
    <>
      <h2>Programm Samstag</h2>
      <ProgramOfDay programByHour={saturdayByHour} />
    </>
  );
}
