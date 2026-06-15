import {
  WeekendTimetable,
  type ProgramEntryTimetablePreView,
  type ProgramEntryTimetableView,
} from "@common/components/Timetable";
import { createSignal, type Accessor, type JSX } from "solid-js";
import { getDay, openingHours } from "@rst/components/anmeldung/constant/time";
import { DayFilter, type DayFilterState } from "@common/components/Filter";
import type { Save } from "@rst/components/anmeldung/api/save";
import {
  formatTime,
  formatTimeDuration,
  type PerDay,
  type PlainTimeRange,
  type ProgramDay,
} from "@common/utils/time";
import type { IconType } from "@common/components/Icon";
import { Chip } from "@common/components/Chip";
import { IconOnlyButton } from "@common/components/Button";
import { Link } from "@common/components/Link";
import { parsePlainTime } from "@common/components/events";
import { getErrors } from "@rst/components/anmeldung/constant/validation";
import { Temporal } from "@js-temporal/polyfill";
import type { Program } from "@rst/components/anmeldung/api/program";
import type { Reactive } from "@common/utils/reactivity";
import { mapGroupBy } from "@common/utils/group";
import { assert } from "@common/components/utils";

export function Timeview(props: {
  save$: Reactive<Save>;
  programData: Accessor<Program>;
}): JSX.Element {
  const [dayFilter, setDayFilter] = createSignal<DayFilterState>(null);
  const personalProgram = () =>
    aggregateEntries(props.save$, props.programData);

  const excludedDays = () => getExcludedDays(personalProgram());
  const hours = openingHours;

  return (
    <div>
      <h3>Mein Programm</h3>
      <br />
      <DayFilter
        dayFilter={dayFilter}
        setDayFilter={setDayFilter}
        exclude={excludedDays()}
      />
      <br />
      <WeekendTimetable
        dayFilter={dayFilter()}
        programEntries={personalProgram()}
        openingHours={hours}
        conflictsAllowed={false}
        columns={1}
        exclude={excludedDays()}
      />
    </div>
  );
}

export function aggregateEntries(
  save$: Reactive<Save>,
  programState: Accessor<Program>,
): PerDay<ProgramEntryTimetableView[]> {
  const {
    contact: { name },
    program: { organising, reserved },
  } = save$.get();

  const aggregation: PerDay<ProgramEntryTimetablePreView[]> = {
    FRIDAY: [],
    SATURDAY: [],
    SUNDAY: [],
  };

  organising.forEach((entry) => {
    if (entry.status !== "published") {
      return;
    }
    const errors = getErrors(entry);
    if (errors.hasErrors) {
      return;
    }

    entry.timeSlots.forEach((slot) => {
      const parsedStartTime = parsePlainTime(slot.slot.start.time);
      if (parsedStartTime.kind === "ERROR") {
        return;
      }
      const parsedEndTime = parsePlainTime(slot.slot.end.time);
      if (parsedEndTime.kind === "ERROR") {
        return;
      }

      const range: PlainTimeRange = {
        startTime: parsedStartTime.value,
        endTime: parsedEndTime.value,
      };
      const path = `/erstellen/${entry.uuid}`;

      aggregation[getDay(slot.slot.start.day) ?? "FRIDAY"].push({
        name: name,
        timeSlotUuid: slot.uuid,
        range,
        title: entry.title,
        kind: "master",
        path: path,
      });
    });
  });

  reserved.forEach((entry) => {
    const programmEntry = programState().publicEntries.find(
      (p) => p.timeSlot.uuid === entry.entryUuid,
    );
    if (programmEntry === undefined) {
      return;
    }

    const startTime = Temporal.PlainTime.from(
      programmEntry.timeSlot.slot.start.time,
    );
    const endTime = startTime.add(
      Temporal.Duration.from(programmEntry.timeSlot.slot.duration),
    );

    const range: PlainTimeRange = {
      startTime,
      endTime,
    };
    const path = `/programm/${programmEntry.timeSlot.uuid}`;

    const day = getDay(programmEntry.timeSlot.slot.start.day);
    if (day === null) {
      return;
    }

    aggregation[day].push({
      name: entry.name.kind === "SELF" ? name : entry.name.friendsName,
      timeSlotUuid: programmEntry.timeSlot.uuid,
      range,
      title: programmEntry.title,
      kind: "play",
      path: path,
    });
  });

  function combineNames(
    entries: ProgramEntryTimetablePreView[],
  ): ProgramEntryTimetableView[] {
    return Object.values(
      mapGroupBy(
        entries,
        (entry) => entry.timeSlotUuid,
        (entries): ProgramEntryTimetableView => {
          const first = entries[0];
          assert(first !== undefined, "");
          const names = entries.map((entry) => entry.name);
          return {
            names: names,
            timeSlotUuid: first.timeSlotUuid,
            range: first.range,
            component: () => (
              <TimeviewEntry
                kind={first.kind}
                path={first.path}
                range={first.range}
                title={first.title}
                names={names}
              />
            ),
          } satisfies ProgramEntryTimetableView;
        },
      ),
    );
  }

  return {
    FRIDAY: sort(combineNames(aggregation.FRIDAY)),
    SATURDAY: sort(combineNames(aggregation.SATURDAY)),
    SUNDAY: sort(combineNames(aggregation.SUNDAY)),
  };
}

function sort(
  entries: ProgramEntryTimetableView[],
): ProgramEntryTimetableView[] {
  return entries.toSorted(
    (a, b) =>
      Temporal.PlainTime.compare(a.range.startTime, b.range.startTime) ||
      Temporal.PlainTime.compare(a.range.endTime, b.range.endTime),
  );
}

export type TimeviewKind = "master-draft" | "master" | "play" | "help";

function TimeviewEntry(props: {
  title: string;
  range: PlainTimeRange;
  kind: TimeviewKind;
  path: string;
  names: string[];
}): JSX.Element {
  const labels = (
    {
      "master-draft": {
        label: "SL",
        help: "Spielleitung",
        link: {
          icon: "pencil",
          label: "Spielrunde bearbeiten",
        },
      },
      master: {
        label: "SL",
        help: "Spielleitung",
        link: {
          icon: "pencil",
          label: "Spielrunde bearbeiten",
        },
      },
      play: {
        label: "TN",
        help: "Teilnehmer:in",
        link: {
          icon: "link",
          label: "Zur Spielrunde",
        },
      },
      help: {
        label: "HL",
        help: "Helfen",
        link: {
          icon: "link",
          label: "Zum Eintrag",
        },
      },
    } satisfies Record<
      TimeviewKind,
      {
        label: string;
        help: string;
        link: {
          icon: IconType;
          label: string;
        };
      }
    >
  )[props.kind];

  const classes = () => {
    const cls = ["timeview-entry", "box-simple"];

    if (props.kind === "master-draft") {
      cls.push("gray");
    }

    if (props.kind === "master") {
      cls.push("special");
    }

    if (props.kind === "play") {
      cls.push("danger");
    }

    return cls.join(" ");
  };

  return (
    <div class={classes()}>
      <Link href={props.path} class="button-link" style="display: contents;">
        <Chip title={labels.help} inverted={props.kind !== "help"} size="small">
          {labels.label}
        </Chip>
        <IconOnlyButton
          icon={labels.link.icon}
          kind="ghost"
          title={labels.link.label}
        />
        <h5 title={props.title}>{props.title}</h5>
        <p class="duration">
          <span>{props.names.join(", ")}</span> | von{" "}
          {formatTime(props.range.startTime)} bis{" "}
          {formatTime(props.range.endTime)} Uhr{" "}
          <em>
            <small>
              ({formatTimeDuration(props.range.startTime, props.range.endTime)})
            </small>
          </em>
        </p>
      </Link>
    </div>
  );
}

function getExcludedDays(
  personalProgram: PerDay<ProgramEntryTimetableView[]>,
): ProgramDay[] {
  const exludeDays: ProgramDay[] = [];
  if (personalProgram.FRIDAY.length === 0) {
    exludeDays.push("FRIDAY");
  }

  if (personalProgram.SATURDAY.length === 0) {
    exludeDays.push("SATURDAY");
  }

  if (personalProgram.SUNDAY.length === 0) {
    exludeDays.push("SUNDAY");
  }

  if (exludeDays.length === 3) {
    return ["FRIDAY"];
  }

  return exludeDays;
}
