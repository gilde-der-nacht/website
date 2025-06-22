import { For, type JSX } from "solid-js";
import {
  openingHours,
  type OpeningHours,
} from "@rst/components/anmeldung/constant/hours";
import { getHours, type TimeRange } from "@rst/components/anmeldung/utils/time";

export type TimetableConfiguration = {
  start: number;
  end: number;
};

export function WeekendTimetable(): JSX.Element {
  return (
    <div class="dynamic-columns" style="gap: 1rem; --min-width: 30rem;">
      <div>
        <h4 style="margin-block-end: 1.5rem;">Samstag</h4>
        <Timetable programEntries={[]} openingHours={openingHours.SATURDAY} />
      </div>
      <div>
        <h4 style="margin-block-end: 1.5rem;">Sonntag</h4>
        <Timetable programEntries={[]} openingHours={openingHours.SUNDAY} />
      </div>
    </div>
  );
}

type ProgramEntry = {
  range: TimeRange;
  component: JSX.Element;
};

export function Timetable(props: {
  programEntries: ProgramEntry[];
  openingHours: OpeningHours;
}): JSX.Element {
  const hours = getHours(props.openingHours.open);
  const breaks = props.openingHours.breaks.map(({ from }) => from);
  const offset = (hours[0] ?? 0) - 1;
  const lastHour = hours.at(-1) ?? 0;
  return (
    <div class="timetable">
      <div class="entries" style={`grid-row: 1 / ${lastHour - offset + 1};`}>
        <For each={props.programEntries}>
          {(entry) => (
            <div class="entry" style={rangeToGridRow(entry.range, offset)}>
              {entry.component}
            </div>
          )}
        </For>
      </div>
      <For each={hours}>
        {(hour) => {
          const isBreak = breaks.includes(hour);
          return (
            <div
              class={`hour ${isBreak ? "break" : ""}`}
              style={rangeToGridRow({ from: hour, to: hour }, offset)}
            >
              <div class="annotation">{hour}</div>
              <div class="background"></div>
            </div>
          );
        }}
      </For>
      <div class="after-hour">
        <div class="annotation">{lastHour + 1}</div>
      </div>
    </div>
  );
}
function rangeToGridRow(range: TimeRange, offset: number): string {
  const { from, to } = range;
  return `grid-row: ${from - offset} / ${to - offset};`;
}
