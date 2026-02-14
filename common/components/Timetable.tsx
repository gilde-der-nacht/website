import { For, Match, Show, Switch, type JSX } from "solid-js";
import {
  getHours,
  isOverlapping,
  type PerDay,
  type ProgramDay,
  type HourRange,
  type PlainTimeRange,
} from "@common/utils/time";
import { assert } from "@common/components/utils";
import { Box } from "@common/components/Box";
import { Icon } from "@common/components/Icon";
import { TXT } from "@common/utils/texts";
import { Heading } from "@common/components/Heading";
import { Temporal } from "@js-temporal/polyfill";

export type WeekendOpeningHours = PerDay<{
  open: HourRange;
  breaks: HourRange[];
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
  columns: 1 | 2 | 4;
  dayFilter: ProgramDay | null;
  exclude?: ProgramDay[];
}): JSX.Element {
  const exclude = props.exclude ?? [];

  return (
    <div style="display: grid; gap: 1rem;">
      <Show
        when={
          !exclude.includes("FRIDAY") &&
          props.openingHours.FRIDAY.open.from !==
            props.openingHours.FRIDAY.open.to &&
          (props.dayFilter === null || props.dayFilter === "FRIDAY")
        }
      >
        <TimetableOfDay
          programEntries={props.programEntries.FRIDAY}
          openingHoursOfDay={props.openingHours.FRIDAY}
          day="FRIDAY"
          conflictsAllowed={props.conflictsAllowed ?? false}
          columns={props.columns}
        />
      </Show>
      <Show
        when={
          (!exclude.includes("SATURDAY") && props.dayFilter === null) ||
          props.dayFilter === "SATURDAY"
        }
      >
        <TimetableOfDay
          programEntries={props.programEntries.SATURDAY}
          openingHoursOfDay={props.openingHours.SATURDAY}
          day="SATURDAY"
          conflictsAllowed={props.conflictsAllowed ?? false}
          columns={props.columns}
        />
      </Show>
      <Show
        when={
          (!exclude.includes("SUNDAY") && props.dayFilter === null) ||
          props.dayFilter === "SUNDAY"
        }
      >
        <TimetableOfDay
          programEntries={props.programEntries.SUNDAY}
          openingHoursOfDay={props.openingHours.SUNDAY}
          day="SUNDAY"
          conflictsAllowed={props.conflictsAllowed ?? false}
          columns={props.columns}
        />
      </Show>
    </div>
  );
}

function TimetableOfDay(props: {
  programEntries: ProgramEntryTimetableView[];
  openingHoursOfDay: OpeningHours;
  day: ProgramDay;
  conflictsAllowed: boolean;
  columns: 1 | 2 | 4;
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
  range: PlainTimeRange;
  component: () => JSX.Element;
};

export function Timetable(props: {
  programEntries: ProgramEntryTimetableView[];
  openingHoursOfDay: OpeningHours;
  day: ProgramDay;
  conflictsAllowed: boolean;
  columns: 1 | 2 | 4;
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
      cls.push(
        props.columns === 2
          ? "two-columns"
          : props.columns === 4
            ? "four-columns"
            : "",
      );
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
                {
                  startTime: Temporal.PlainTime.from({ hour, minute: 0 }),
                  endTime: Temporal.PlainTime.from({ hour, minute: 0 }),
                },
                offset,
                props.day,
                props.openingHoursOfDay,
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
                props.openingHoursOfDay,
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
  range: PlainTimeRange,
  offset: number,
  day: ProgramDay,
  openingHoursOfDay: OpeningHours,
): string {
  const { startTime, endTime } = range;
  const startRow = startTime.hour - offset;
  const endRow = endTime.hour === 0 ? 24 - offset : endTime.hour - offset; // Hack for midnight
  const closingHour = openingHoursOfDay.open.to;

  assert(
    startRow > 0,
    `[${JSON.stringify(range)}] Entry can't start at '${startTime.hour}'.`,
  );
  assert(
    endRow > 0,
    `[${JSON.stringify(range)}] Entry can't end at '${endTime.hour}'.`,
  );
  assert(
    endTime.hour <= closingHour,
    `[${JSON.stringify(range)}] Entry can't end at '${endTime.hour}'. Closing hour set to '${closingHour}' on day '${day}'`,
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
