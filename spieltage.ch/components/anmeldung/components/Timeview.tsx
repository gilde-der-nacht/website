import { Heading } from "@common/components/Heading";
import {
  WeekendTimetable,
  type ProgramEntryTimetableView,
  type WeekendOpeningHours,
} from "@common/components/Timetable";
import { createSignal, type JSX } from "solid-js";
import {
  defaultPlainDates,
  getDay,
  openingHours,
} from "@lst/components/anmeldung/constant/time";
import { DayFilter, type DayFilterState } from "@common/components/Filter";
import type { Public } from "@lst/components/anmeldung/api/public";
import type { Save } from "@lst/components/anmeldung/api/save";
import {
  formatTime,
  formatTimeDuration,
  type PerDay,
  type PlainDateTimeRange,
  type PlainTimeRange,
  type ProgramDay,
} from "@common/utils/time";
import {
  helpTimes,
  helpTypes,
  openingHoursHelping,
} from "@lst/components/anmeldung/constant/helping";
import { assert } from "@common/components/utils";
import type { IconType } from "@common/components/Icon";
import { Chip } from "@common/components/Chip";
import { IconOnlyButton } from "@common/components/Button";
import { Link } from "@common/components/Link";
import { parsePlainTime } from "@common/components/events";
import { getErrors } from "../constant/validation";

export function Timeview(props: {
  save: Save;
  publicState: Public;
}): JSX.Element {
  const [dayFilter, setDayFilter] = createSignal<DayFilterState>(null);
  const personalProgram = aggregateEntries(props.save, props.publicState);

  const excludedDays = getExcludedDays(personalProgram);
  const hours = getOpeningHours(personalProgram);

  return (
    <div>
      <Heading level={3} title="Mein Programm" />
      <br />
      <DayFilter
        dayFilter={dayFilter}
        setDayFilter={setDayFilter}
        exclude={excludedDays}
      />
      <br />
      <WeekendTimetable
        dayFilter={dayFilter()}
        programEntries={personalProgram}
        openingHours={hours}
        conflictsAllowed={false}
        columns={1}
        exclude={excludedDays}
      />
    </div>
  );
}

function aggregateEntries(
  save: Save,
  publicState: Public,
): PerDay<ProgramEntryTimetableView[]> {
  const {
    helping,
    program: { organising, participating },
  } = save;

  const aggregation: PerDay<ProgramEntryTimetableView[]> = {
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
      const parsedStartTime = parsePlainTime(slot.start.time);
      if (parsedStartTime.kind === "ERROR") {
        return;
      }
      const parsedEndTime = parsePlainTime(slot.end.time);
      if (parsedEndTime.kind === "ERROR") {
        return;
      }

      const range: PlainTimeRange = {
        startTime: parsedStartTime.value,
        endTime: parsedEndTime.value,
      };
      const path = `/erstellen/${entry.uuid}`;

      aggregation[slot.start.day].push({
        range,
        component: () => (
          <TimeviewEntry
            title={entry.title}
            range={range}
            kind="master"
            path={path}
          />
        ),
      });
    });
  });

  const helpEntries = helping.map((entry) => {
    if (entry.kind === "ERKLAERBAER") {
      const dateTime: PlainDateTimeRange = {
        startDate: defaultPlainDates[entry.slot.day].toPlainDateTime({
          hour: entry.slot.from,
          minute: 0,
        }),
        endDate: defaultPlainDates[entry.slot.day].toPlainDateTime({
          hour: entry.slot.to,
          minute: 0,
        }),
      };
      return {
        ...entry,
        meta: {
          dateTime,
        },
      };
    }
    const meta = helpTimes.find((h) => h.uuid === entry.entryUuid);
    assert(meta !== undefined, `Help UUID is invalid: '${entry.entryUuid}'`);
    return { ...entry, meta };
  });

  const groupedHelpEntries = Object.groupBy(helpEntries, (e) => {
    const { startDate, endDate } = e.meta.dateTime;
    return `${startDate.year}-${startDate.month}-${startDate.day}-${startDate.hour}-${startDate.minute}--${endDate.year}-${endDate.month}-${endDate.day}-${endDate.hour}-${endDate.minute}`;
  });

  Object.values(groupedHelpEntries).forEach((entries) => {
    if (entries === undefined) {
      return;
    }

    const first = entries[0];
    if (first === undefined) {
      return;
    }

    let onlyMe = true;
    const jobsAndNames = entries.map((e): [string, string] => {
      if (e.kind === "ERKLAERBAER") {
        return ["Erklärbär", "ME"];
      }
      if (e.kind === "SELF") {
        return [helpTypes[e.meta.kind].title, "ME"];
      }
      onlyMe = false;
      return [helpTypes[e.meta.kind].title, e.name];
    });

    const title = onlyMe
      ? jobsAndNames.map(([job]) => job).join(", ")
      : jobsAndNames
          .map(([job, name]) => {
            if (name === "ME") {
              return job;
            }
            return `${job} (${name})`;
          })
          .join("; ");

    const day = getDay(first.meta.dateTime.startDate);
    assert(
      day !== null,
      `Date '${JSON.stringify(first.meta.dateTime.startDate)}' is not a valid event date.`,
    );

    const range: PlainTimeRange = {
      startTime: first.meta.dateTime.startDate.toPlainTime(),
      endTime: first.meta.dateTime.endDate.toPlainTime(),
    };
    const path =
      first.kind === "ERKLAERBAER"
        ? "/erklaerbaer"
        : `/helfen/${first.entryUuid}`;

    aggregation[day].push({
      range,
      component: () => (
        <TimeviewEntry title={title} range={range} kind="help" path={path} />
      ),
    });
  });

  helpEntries.forEach((entry) => {
    switch (entry.kind) {
      case "SELF": {
        const day = getDay(entry.meta.dateTime.startDate);
        assert(
          day !== null,
          `Date '${JSON.stringify(entry.meta.dateTime.startDate)}' is not a valid event date.`,
        );
        break;
      }
      case "FRIEND": {
        const day = getDay(entry.meta.dateTime.startDate);
        assert(
          day !== null,
          `Date '${JSON.stringify(entry.meta.dateTime.startDate)}' is not a valid event date.`,
        );
        break;
      }
      case "ERKLAERBAER": {
        break;
      }
    }
  });

  return aggregation;
}

type TimeviewKind = "master-draft" | "master" | "play" | "help";

function TimeviewEntry(props: {
  title: string;
  range: PlainTimeRange;
  kind: TimeviewKind;
  path: string;
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
          von {formatTime(props.range.startTime)} bis{" "}
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

function getOpeningHours(
  personalProgram: PerDay<ProgramEntryTimetableView[]>,
): WeekendOpeningHours {
  const hours: WeekendOpeningHours = openingHours;

  if (personalProgram.FRIDAY.length > 0) {
    hours.FRIDAY = openingHoursHelping.FRIDAY;
  }

  let saturdayOverflow = false;

  personalProgram.SATURDAY.forEach((e) => {
    if (e.range.startTime.hour < hours.SATURDAY.open.from) {
      saturdayOverflow = true;
    }
    if (e.range.endTime.hour > hours.SATURDAY.open.to) {
      saturdayOverflow = true;
    }
  });

  if (saturdayOverflow) {
    hours.SATURDAY = openingHoursHelping.SATURDAY;
  }

  let sundayOverflow = false;

  personalProgram.SUNDAY.forEach((e) => {
    if (e.range.startTime.hour < hours.SUNDAY.open.from) {
      sundayOverflow = true;
    }
    if (e.range.endTime.hour > hours.SUNDAY.open.to) {
      sundayOverflow = true;
    }
  });

  if (sundayOverflow) {
    hours.SUNDAY = openingHoursHelping.SUNDAY;
  }

  return hours;
}
