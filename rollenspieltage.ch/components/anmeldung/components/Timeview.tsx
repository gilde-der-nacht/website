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
  durationToTemporal,
  formatTime,
  formatTimeDuration,
  type PerDay,
  type PlainTimeRange,
  type ProgramDay,
} from "@common/utils/time";
import type { IconType } from "@common/components/Icon";
import { Chip } from "@common/components/Chip";
import { IconOnlyButton } from "@common/components/Button";
import { RouterLink } from "@common/components/Link";
import { Temporal } from "@js-temporal/polyfill";
import type { Program } from "@rst/components/anmeldung/api/program";
import type { Reactive } from "@common/utils/reactivity";
import { mapGroupBy } from "@common/utils/group";
import { assert } from "@common/components/utils";
import type { RegistrationUuid } from "@common/utils/ids";

export function Timeview(props: {
  save$: Reactive<Save>;
  programData: Accessor<Program>;
  secret: RegistrationUuid;
}): JSX.Element {
  const [dayFilter, setDayFilter] = createSignal<DayFilterState>(null);
  const personalProgram = () =>
    aggregateEntries({
      save$: props.save$,
      programData: props.programData,
      secret: props.secret,
    });

  const excludedDays = () => getExcludedDays(personalProgram());
  const hours = openingHours;

  return (
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <h3>Mein Programm</h3>
      <DayFilter
        dayFilter={dayFilter}
        setDayFilter={setDayFilter}
        exclude={excludedDays()}
      />
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

export function aggregateEntries(props: {
  save$: Reactive<Save>;
  programData: Accessor<Program>;
  secret: RegistrationUuid;
}): PerDay<ProgramEntryTimetableView[]> {
  const {
    contact: { name },
  } = props.save$.get();

  const aggregation: PerDay<ProgramEntryTimetablePreView[]> = {
    FRIDAY: [],
    SATURDAY: [],
    SUNDAY: [],
  };

  props
    .programData()
    .publicEntries.filter((entry) => entry.myEntry)
    .forEach((entry) => {
      if (entry.status !== "published") {
        return;
      }

      const { startTime, endTime } = durationToTemporal(entry.timeSlot.slot);
      const range: PlainTimeRange = {
        startTime,
        endTime,
      };
      const path = `/erstellen/${entry.uuid}`;

      aggregation[getDay(entry.timeSlot.slot.start.day) ?? "FRIDAY"].push({
        name: name,
        timeSlotUuid: entry.timeSlot.uuid,
        range,
        title: entry.title,
        kind: "master",
        path: path,
      });
    });

  props.programData().publicEntries.forEach((programEntry) => {
    const { reserved, waiting } = programEntry.participation;

    const { startTime, endTime } = durationToTemporal(
      programEntry.timeSlot.slot,
    );

    const range: PlainTimeRange = {
      startTime,
      endTime,
    };

    const path = `/programm/${programEntry.timeSlot.uuid}`;

    const day = getDay(programEntry.timeSlot.slot.start.day);
    if (day === null) {
      return;
    }

    reserved
      .filter((entry) => props.secret.startsWith(entry.groupId))
      .forEach((reservedEntry) => {
        assert(
          reservedEntry.name !== null,
          "Should have names of all owned entries!",
        );
        aggregation[day].push({
          name: reservedEntry.name,
          timeSlotUuid: programEntry.timeSlot.uuid,
          range,
          title: programEntry.title,
          kind: "play",
          path: path,
        });
      });

    waiting
      .filter((entry) => props.secret.startsWith(entry.groupId))
      .forEach((reservedEntry) => {
        assert(
          reservedEntry.name !== null,
          "Should have names of all owned entries!",
        );
        aggregation[day].push({
          name: reservedEntry.name,
          timeSlotUuid: programEntry.timeSlot.uuid,
          range,
          title: programEntry.title,
          kind: "waiting",
          path: path,
        });
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

export type TimeviewKind =
  | "master-draft"
  | "master"
  | "play"
  | "help"
  | "waiting";

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
      waiting: {
        label: "WL",
        help: "Warteliste",
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
      <RouterLink
        href={props.path}
        class="button-link"
        style="display: contents;"
      >
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
      </RouterLink>
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
