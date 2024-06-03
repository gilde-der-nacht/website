import type { JSX } from "solid-js/jsx-runtime";
import { getByDayAndHour, type Program, type ProgramByHour } from "./data";
import { Box } from "@common/components/Box";

export function ProgramOfDay(props: {
  programByHour: ProgramByHour;
}): JSX.Element {
  return (
    <>
      {props.programByHour.map(([hour, entries]) => (
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
                    <strong>Zeit:</strong> {entry.slot.start} - {entry.slot.end}{" "}
                    Uhr
                  </div>
                  <div class="event-tags">
                    <strong>Spielleitung:</strong> {entry.master.first}{" "}
                    {entry.master.last}
                  </div>
                  <div class="event-tags">
                    <strong>Spielende:</strong> {entry.playerCount.min} -{" "}
                    {entry.playerCount.max}
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
