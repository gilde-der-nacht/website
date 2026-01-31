import { For, Match, Show, Switch, type JSX } from "solid-js";
import {
  getHours,
  isOverlapping,
  type PerDay,
  type ProgramDay,
  type TimeRange,
} from "@common/utils/time";
import { assert } from "@common/components/utils";
import { Box } from "@common/components/Box";
import { Icon } from "@common/components/Icon";
import { TXT } from "@common/utils/texts";
import { Heading } from "@common/components/Heading";

export type WeekendOpeningHours = PerDay<{
  open: TimeRange;
  breaks: TimeRange[];
}>;
export type OpeningHours = WeekendOpeningHours[ProgramDay];

export type TimetableConfiguration = {
  start: number;
  end: number;
};

export function WeekendTimetable(props: {
  programEntries: PerDay<ProgramEntryTimetableView[]>;
  conflictsAllowed?: boolean;
  openingHours: WeekendOpeningHours;
  columns: 2 | 4;
}): JSX.Element {
  return (
    <div class="dynamic-columns" style="gap: 1rem; --min-width: 30rem;">
      <Show
        when={
          props.openingHours.FRIDAY.open.from !==
          props.openingHours.FRIDAY.open.to
        }
      >
        <TimetableOfDay
          programEntries={props.programEntries.FRIDAY}
          openingHoursOfDay={props.openingHours.FRIDAY}
          openingHours={props.openingHours}
          day="FRIDAY"
          conflictsAllowed={props.conflictsAllowed ?? false}
          columns={props.columns}
        />
      </Show>
      <TimetableOfDay
        programEntries={props.programEntries.SATURDAY}
        openingHoursOfDay={props.openingHours.SATURDAY}
        openingHours={props.openingHours}
        day="SATURDAY"
        conflictsAllowed={props.conflictsAllowed ?? false}
        columns={props.columns}
      />
      <TimetableOfDay
        programEntries={props.programEntries.SUNDAY}
        openingHoursOfDay={props.openingHours.SUNDAY}
        openingHours={props.openingHours}
        day="SUNDAY"
        conflictsAllowed={props.conflictsAllowed ?? false}
        columns={props.columns}
      />
    </div>
  );
}

function TimetableOfDay(props: {
  programEntries: ProgramEntryTimetableView[];
  openingHoursOfDay: OpeningHours;
  openingHours: WeekendOpeningHours;
  day: ProgramDay;
  conflictsAllowed: boolean;
  columns: 2 | 4;
}): JSX.Element {
  const conflictingEntries = props.conflictsAllowed
    ? []
    : findConflicts(props.programEntries);

  return (
    <div>
      <div style="margin-block-end: 1.5rem;">
        <Heading level={4} title={TXT.days[props.day]} />
      </div>
      <Switch
        fallback={
          <>
            <Box type="danger">
              <p>
                Konflikte gefunden! Bitte stelle sicher, dass du nicht zeitlich
                überlappende Spielrunden eingetragen hast:
              </p>
            </Box>
            <For each={conflictingEntries}>
              {([a, b]) => (
                <div style="display: grid; grid-template-columns: 1fr max-content 1fr; gap: 1rem; margin-block: 0.5rem;">
                  {a.component()}
                  <span style="color: var(--clr-warning-10); align-self: center; font-size: 2rem;">
                    <Icon icon="triangle-exclamation" />
                  </span>
                  {b.component()}
                </div>
              )}
            </For>
          </>
        }
      >
        <Match when={conflictingEntries.length === 0}>
          <Timetable
            programEntries={props.programEntries}
            openingHoursOfDay={props.openingHoursOfDay}
            openingHours={props.openingHours}
            day={props.day}
            conflictsAllowed={props.conflictsAllowed}
            columns={props.columns}
          />
        </Match>
      </Switch>
    </div>
  );
}

export type ProgramEntryTimetableView = {
  range: TimeRange;
  component: () => JSX.Element;
};

export function Timetable(props: {
  programEntries: ProgramEntryTimetableView[];
  openingHoursOfDay: OpeningHours;
  openingHours: WeekendOpeningHours;
  day: ProgramDay;
  conflictsAllowed: boolean;
  columns: 2 | 4;
}): JSX.Element {
  const hours = getHours(props.openingHoursOfDay.open);
  const breaks = props.openingHoursOfDay.breaks.flatMap(({ from, to }) => {
    assert(
      from < to,
      `Break is not valid, as from '${from}' is not smaller than to '${to}'`,
    );
    const list = [from];
    let count = to - from;
    while (count > 1) {
      list.push(from + --count);
    }
    return list;
  });
  const offset = (hours[0] ?? 0) - 1;
  const lastHour = hours.at(-1) ?? 0;

  const classes = () => {
    const cls = ["timetable"];
    if (props.conflictsAllowed) {
      cls.push(props.columns === 2 ? "two-columns" : "four-columns");
    }
    return cls.join(" ");
  };

  return (
    <div class={classes()}>
      <For each={hours}>
        {(hour) => {
          const isBreak = breaks.includes(hour);
          return (
            <div
              class={`hour ${isBreak ? "break" : ""}`}
              style={rangeToGridRow(
                { from: hour, to: hour },
                offset,
                props.day,
                props.openingHours,
              )}
            >
              <div class="annotation">{hour}</div>
              <div class="background"></div>
            </div>
          );
        }}
      </For>
      <div class="entries" style={`grid-row: 1 / ${lastHour - offset + 1};`}>
        <For each={props.programEntries}>
          {(entry) => (
            <div
              class="entry"
              style={rangeToGridRow(
                entry.range,
                offset,
                props.day,
                props.openingHours,
              )}
            >
              {entry.component()}
            </div>
          )}
        </For>
      </div>
      <div class="after-hour">
        <div class="annotation">{lastHour + 1}</div>
      </div>
    </div>
  );
}

function rangeToGridRow(
  range: TimeRange,
  offset: number,
  day: ProgramDay,
  openingHours: WeekendOpeningHours,
): string {
  const { from, to } = range;
  const startRow = from - offset;
  const endRow = to - offset;
  const closingHour = openingHours[day].open.to;

  assert(
    startRow > 0,
    `[${JSON.stringify(range)}] Entry can't start at ${from}.`,
  );
  assert(endRow > 0, `[${JSON.stringify(range)}] Entry can't end at ${to}.`);
  assert(
    to <= closingHour,
    `[${JSON.stringify(range)}] Entry can't end at ${to}. Closing hour set to '${closingHour}' on day '${day}'`,
  );

  return `grid-row: ${startRow} / ${endRow};`;
}

type Conflicts = [ProgramEntryTimetableView, ProgramEntryTimetableView][];

function findConflicts(entries: ProgramEntryTimetableView[]): Conflicts {
  const conflicts: Conflicts = [];

  entries.forEach((a, i) => {
    entries.slice(i + 1).forEach((b) => {
      if (isOverlapping(a.range, b.range)) {
        conflicts.push([a, b]);
      }
    });
  });

  return conflicts;
}
