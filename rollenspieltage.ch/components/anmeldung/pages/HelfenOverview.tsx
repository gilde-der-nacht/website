import { createSignal, type Accessor, type JSX, type Setter } from "solid-js";
import type { HelpingReservation } from "@rst/components/anmeldung/api/save";
import type { Roles } from "@rst/components/anmeldung/api/meta";
import { DayFilter, type DayFilterState } from "@common/components/Filter";
import type { Reactive } from "@common/utils/reactivity";
import { Box } from "@common/components/Box";
import type {
  AdminHelpEntry,
  Constants,
  PublicAdmin,
} from "@rst/components/anmeldung/api/admin";
import {
  helpTimes,
  helpTypes,
  openingHoursHelping,
} from "@rst/components/anmeldung/constant/helping";
import { assert } from "@common/components/utils";
import { getDay } from "@rst/components/anmeldung/constant/time";
import { Temporal } from "@js-temporal/polyfill";
import type { PerDay, ProgramDay } from "@common/utils/time";
import { parsePlainTime } from "@common/components/events";
import { Button } from "@common/components/Button";
import { mapGroupBy } from "@common/utils/group";
import {
  Timetable,
  type ProgramEntryTimetableView,
} from "@common/components/Timetable";

type GroupFilterState = "byName" | "byType";

export function HelfenOverview(props: {
  reservations$: Reactive<HelpingReservation[]>;
  adminData: PublicAdmin;
  roles: Roles;
}): JSX.Element {
  const [dayFilter, setDayFilter] = createSignal<DayFilterState>(null);
  const [groupFilter, setGroupFilter] =
    createSignal<GroupFilterState>("byType");

  const { admin } = props.adminData;

  if (admin === null) {
    return <Box type="danger">Du hast keinen Zugriff auf diesen Bereich.</Box>;
  }

  const entries = normalizeEntries(
    admin.help,
    okEntriesByName,
    admin.constants,
  );

  return (
    <>
      <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
        <DayFilter dayFilter={dayFilter} setDayFilter={setDayFilter} />
        <GroupFilter
          groupFilter={groupFilter}
          setGroupFilter={setGroupFilter}
        />
      </div>
      <br />
      <Content
        entries={entries}
        dayFilter={dayFilter}
        groupFilter={groupFilter}
      />
    </>
  );
}

function Content(props: {
  entries: HelpEntry[];
  dayFilter: Accessor<DayFilterState>;
  groupFilter: Accessor<GroupFilterState>;
}): JSX.Element {
  const g = () => applyGrouping(props.entries, props.groupFilter());

  return (
    <>
      {props.dayFilter() === null || props.dayFilter() === "FRIDAY" ? (
        <>
          <h3>Freitag</h3>
          {Object.entries(g().FRIDAY).map(([label, cells]) => (
            <>
              <h4>{label}</h4>
              <br />
              <div class="table-container" style="padding-block: 1rem;">
                <Timetable
                  programEntries={cells.map(
                    (cell): ProgramEntryTimetableView => ({
                      range: {
                        startTime: cell.slot.from,
                        endTime: cell.slot.to,
                      },
                      component: () => (
                        <div class="timeview-entry box-simple">
                          {cell.label}
                        </div>
                      ),
                    }),
                  )}
                  openingHoursOfDay={openingHoursHelping.FRIDAY}
                  day="FRIDAY"
                  conflictsAllowed={true}
                  columns={4}
                />
              </div>
            </>
          ))}
        </>
      ) : null}
      {props.dayFilter() === null || props.dayFilter() === "SATURDAY" ? (
        <>
          <h3>Samstag</h3>
          {Object.entries(g().SATURDAY).map(([label, cells]) => (
            <>
              <h4>{label}</h4>
              <br />
              <div class="table-container" style="padding-block: 1rem;">
                <Timetable
                  programEntries={cells.map(
                    (cell): ProgramEntryTimetableView => ({
                      range: {
                        startTime: cell.slot.from,
                        endTime: cell.slot.to,
                      },
                      component: () => (
                        <div class="timeview-entry box-simple">
                          {cell.label}
                        </div>
                      ),
                    }),
                  )}
                  openingHoursOfDay={openingHoursHelping.SATURDAY}
                  day="SATURDAY"
                  conflictsAllowed={true}
                  columns={4}
                />
              </div>
            </>
          ))}
        </>
      ) : null}
      {props.dayFilter() === null || props.dayFilter() === "SUNDAY" ? (
        <>
          <h3>Sonntag</h3>
          {Object.entries(g().SUNDAY).map(([label, cells]) => (
            <>
              <h4>{label}</h4>
              <br />
              <div class="table-container" style="padding-block: 1rem;">
                <Timetable
                  programEntries={cells.map(
                    (cell): ProgramEntryTimetableView => ({
                      range: {
                        startTime: cell.slot.from,
                        endTime: cell.slot.to,
                      },
                      component: () => (
                        <div class="timeview-entry box-simple">
                          {cell.label}
                        </div>
                      ),
                    }),
                  )}
                  openingHoursOfDay={openingHoursHelping.SUNDAY}
                  day="SUNDAY"
                  conflictsAllowed={true}
                  columns={4}
                />
              </div>
            </>
          ))}
        </>
      ) : null}
    </>
  );
}

const types = {
  ...helpTypes,
  transport: { title: "Transport" },
  purchase: { title: "Einkauf" },
  hall: { title: "Saal einrichten" },
  erklaerbaer: { title: "Erklärbär" },
  okTop: { title: "OK-Tisch Saal (oben) + Helfenden-Empfang" },
  okDown: { title: "OK-Tisch UK (unten)" },
  foto: { title: "Fotos" },
} as const satisfies Record<string, { title: string }>;
type Type = keyof typeof types;

type HelpEntrySlot = {
  day: ProgramDay;
  from: Temporal.PlainTime;
  to: Temporal.PlainTime;
};

type HelpEntry = {
  name: string;
  type: Type;
  slot: HelpEntrySlot;
  comment?: string | undefined;
};

function normalizeEntries(
  help: AdminHelpEntry[],
  okEntries: OkEntries,
  constants: Constants,
): HelpEntry[] {
  return Object.entries(okEntries)
    .flatMap(([nameKey, entries]) => {
      const name = constants.names[nameKey];
      assert(name !== undefined, `No name found for '${nameKey}'`);
      return entries.map(
        (entry): HelpEntry => ({
          name,
          type: entry.type,
          slot: entry.slot,
          comment: entry.comment,
        }),
      );
    })
    .concat(
      help.map((entry): HelpEntry => {
        if ("ref" in entry) {
          const found = helpTimes.find((h) => h.uuid === entry.ref);
          assert(
            found !== undefined,
            `No help time found with uuid '${entry.ref}'`,
          );
          const day = getDay(found.dateTime.startDate);

          assert(day !== null, "Should not happen");

          return {
            name: entry.name,
            type: found.kind,
            slot: {
              day,
              from: found.dateTime.startDate.toPlainTime(),
              to: found.dateTime.endDate.toPlainTime(),
            },
          };
        } else {
          const from = parsePlainTime(entry.slot.start.time);
          const to = parsePlainTime(entry.slot.end.time);
          assert(from.kind === "TIME", "Should not happen");
          assert(to.kind === "TIME", "Should not happen");

          return {
            name: entry.name,
            type: entry.helpType as Type,
            slot: {
              day: entry.slot.start.day,
              from: from.value,
              to: to.value,
            },
          };
        }
      }),
    );
}

type OkEntries = Record<
  string,
  { type: Type; slot: HelpEntrySlot; comment?: string }[]
>;
const okEntriesByName = {
  Ob: [
    {
      type: "transport",
      comment: "Koordination, Transporter",
      slot: {
        day: "FRIDAY",
        from: Temporal.PlainTime.from({ hour: 15 }),
        to: Temporal.PlainTime.from({ hour: 20 }),
      },
    },
    {
      type: "hall",
      comment: "Beschriftung/Outdoor/Springer",
      slot: {
        day: "FRIDAY",
        from: Temporal.PlainTime.from({ hour: 20 }),
        to: Temporal.PlainTime.from({ hour: 22 }),
      },
    },
    {
      type: "checkout",
      slot: {
        day: "SATURDAY",
        from: Temporal.PlainTime.from({ hour: 22 }),
        to: Temporal.PlainTime.from({ hour: 0 }),
      },
    },
    {
      type: "okTop",
      slot: {
        day: "SATURDAY",
        from: Temporal.PlainTime.from({ hour: 12 }),
        to: Temporal.PlainTime.from({ hour: 14 }),
      },
    },
    {
      type: "okDown",
      slot: {
        day: "SATURDAY",
        from: Temporal.PlainTime.from({ hour: 14 }),
        to: Temporal.PlainTime.from({ hour: 16 }),
      },
    },
    {
      type: "okTop",
      slot: {
        day: "SATURDAY",
        from: Temporal.PlainTime.from({ hour: 16 }),
        to: Temporal.PlainTime.from({ hour: 18 }),
      },
    },
    {
      type: "okTop",
      slot: {
        day: "SATURDAY",
        from: Temporal.PlainTime.from({ hour: 20 }),
        to: Temporal.PlainTime.from({ hour: 22 }),
      },
    },
    {
      type: "foto",
      slot: {
        day: "SATURDAY",
        from: Temporal.PlainTime.from({ hour: 10 }),
        to: Temporal.PlainTime.from({ hour: 0 }),
      },
    },
    {
      type: "okTop",
      slot: {
        day: "SUNDAY",
        from: Temporal.PlainTime.from({ hour: 10 }),
        to: Temporal.PlainTime.from({ hour: 12 }),
      },
    },
    {
      type: "foto",
      slot: {
        day: "SUNDAY",
        from: Temporal.PlainTime.from({ hour: 10 }),
        to: Temporal.PlainTime.from({ hour: 16 }),
      },
    },
    {
      type: "transport",
      slot: {
        day: "SUNDAY",
        from: Temporal.PlainTime.from({ hour: 16 }),
        to: Temporal.PlainTime.from({ hour: 20 }),
      },
    },
  ],
  Ai: [
    {
      type: "purchase",
      slot: {
        day: "FRIDAY",
        from: Temporal.PlainTime.from({ hour: 12 }),
        to: Temporal.PlainTime.from({ hour: 16 }),
      },
    },
    {
      type: "hall",
      slot: {
        day: "FRIDAY",
        from: Temporal.PlainTime.from({ hour: 16 }),
        to: Temporal.PlainTime.from({ hour: 22 }),
      },
    },
    {
      type: "kitchen",
      slot: {
        day: "SATURDAY",
        from: Temporal.PlainTime.from({ hour: 13 }),
        to: Temporal.PlainTime.from({ hour: 15 }),
      },
    },
    {
      type: "kitchen",
      slot: {
        day: "SATURDAY",
        from: Temporal.PlainTime.from({ hour: 17 }),
        to: Temporal.PlainTime.from({ hour: 20 }),
      },
    },
    {
      type: "checkout",
      slot: {
        day: "SATURDAY",
        from: Temporal.PlainTime.from({ hour: 20 }),
        to: Temporal.PlainTime.from({ hour: 22 }),
      },
    },
    {
      type: "okTop",
      slot: {
        day: "SUNDAY",
        from: Temporal.PlainTime.from({ hour: 12 }),
        to: Temporal.PlainTime.from({ hour: 14 }),
      },
    },
    {
      type: "breakdown",
      comment: "Outdoor/Beschriftungen",
      slot: {
        day: "SUNDAY",
        from: Temporal.PlainTime.from({ hour: 17 }),
        to: Temporal.PlainTime.from({ hour: 18 }),
      },
    },
    {
      type: "breakdown",
      comment: "Saal",
      slot: {
        day: "SUNDAY",
        from: Temporal.PlainTime.from({ hour: 18 }),
        to: Temporal.PlainTime.from({ hour: 20 }),
      },
    },
  ],
  Ts: [
    {
      type: "flohmarkt",
      slot: {
        day: "FRIDAY",
        from: Temporal.PlainTime.from({ hour: 19 }),
        to: Temporal.PlainTime.from({ hour: 22 }),
      },
    },
    {
      type: "okDown",
      slot: {
        day: "SATURDAY",
        from: Temporal.PlainTime.from({ hour: 16 }),
        to: Temporal.PlainTime.from({ hour: 20 }),
      },
    },
    {
      type: "okTop",
      slot: {
        day: "SUNDAY",
        from: Temporal.PlainTime.from({ hour: 16 }),
        to: Temporal.PlainTime.from({ hour: 18 }),
      },
    },
    {
      type: "okDown",
      slot: {
        day: "SUNDAY",
        from: Temporal.PlainTime.from({ hour: 12 }),
        to: Temporal.PlainTime.from({ hour: 14 }),
      },
    },
    {
      type: "breakdown",
      comment: "Saal",
      slot: {
        day: "SUNDAY",
        from: Temporal.PlainTime.from({ hour: 18 }),
        to: Temporal.PlainTime.from({ hour: 20 }),
      },
    },
  ],
  Ab: [
    {
      type: "flohmarkt",
      comment: "Koordination",
      slot: {
        day: "FRIDAY",
        from: Temporal.PlainTime.from({ hour: 19 }),
        to: Temporal.PlainTime.from({ hour: 22 }),
      },
    },
    {
      type: "flohmarkt",
      comment: "Verantwortung",
      slot: {
        day: "SATURDAY",
        from: Temporal.PlainTime.from({ hour: 9 }),
        to: Temporal.PlainTime.from({ hour: 0 }),
      },
    },
    {
      type: "flohmarkt",
      comment: "Verantwortung",
      slot: {
        day: "SUNDAY",
        from: Temporal.PlainTime.from({ hour: 10 }),
        to: Temporal.PlainTime.from({ hour: 17 }),
      },
    },
    {
      type: "flohmarkt",
      comment: "Abbau (Koordination)",
      slot: {
        day: "SUNDAY",
        from: Temporal.PlainTime.from({ hour: 17 }),
        to: Temporal.PlainTime.from({ hour: 20 }),
      },
    },
  ],
  Mm: [
    {
      type: "hall",
      slot: {
        day: "FRIDAY",
        from: Temporal.PlainTime.from({ hour: 19 }),
        to: Temporal.PlainTime.from({ hour: 22 }),
      },
    },
    {
      type: "flohmarkt",
      slot: {
        day: "SATURDAY",
        from: Temporal.PlainTime.from({ hour: 9 }),
        to: Temporal.PlainTime.from({ hour: 11 }),
      },
    },
    {
      type: "okDown",
      slot: {
        day: "SATURDAY",
        from: Temporal.PlainTime.from({ hour: 12 }),
        to: Temporal.PlainTime.from({ hour: 14 }),
      },
    },
    {
      type: "okDown",
      slot: {
        day: "SATURDAY",
        from: Temporal.PlainTime.from({ hour: 20 }),
        to: Temporal.PlainTime.from({ hour: 22 }),
      },
    },
    {
      type: "foto",
      slot: {
        day: "SATURDAY",
        from: Temporal.PlainTime.from({ hour: 10 }),
        to: Temporal.PlainTime.from({ hour: 0 }),
      },
    },
    {
      type: "okDown",
      slot: {
        day: "SUNDAY",
        from: Temporal.PlainTime.from({ hour: 10 }),
        to: Temporal.PlainTime.from({ hour: 12 }),
      },
    },
    {
      type: "okDown",
      slot: {
        day: "SUNDAY",
        from: Temporal.PlainTime.from({ hour: 16 }),
        to: Temporal.PlainTime.from({ hour: 18 }),
      },
    },
    {
      type: "breakdown",
      comment: "Saal (Koordination)",
      slot: {
        day: "SUNDAY",
        from: Temporal.PlainTime.from({ hour: 18 }),
        to: Temporal.PlainTime.from({ hour: 20 }),
      },
    },
    {
      type: "foto",
      slot: {
        day: "SUNDAY",
        from: Temporal.PlainTime.from({ hour: 10 }),
        to: Temporal.PlainTime.from({ hour: 17 }),
      },
    },
  ],
  Ps: [
    {
      type: "transport",
      slot: {
        day: "FRIDAY",
        from: Temporal.PlainTime.from({ hour: 15 }),
        to: Temporal.PlainTime.from({ hour: 17 }),
      },
    },
    {
      type: "hall",
      comment: "Koordination",
      slot: {
        day: "FRIDAY",
        from: Temporal.PlainTime.from({ hour: 17 }),
        to: Temporal.PlainTime.from({ hour: 22 }),
      },
    },
    {
      type: "flohmarkt",
      slot: {
        day: "SATURDAY",
        from: Temporal.PlainTime.from({ hour: 9 }),
        to: Temporal.PlainTime.from({ hour: 10 }),
      },
    },
    {
      type: "okDown",
      slot: {
        day: "SATURDAY",
        from: Temporal.PlainTime.from({ hour: 10 }),
        to: Temporal.PlainTime.from({ hour: 12 }),
      },
    },
    {
      type: "okDown",
      slot: {
        day: "SATURDAY",
        from: Temporal.PlainTime.from({ hour: 22 }),
        to: Temporal.PlainTime.from({ hour: 0 }),
      },
    },
    {
      type: "okDown",
      slot: {
        day: "SUNDAY",
        from: Temporal.PlainTime.from({ hour: 14 }),
        to: Temporal.PlainTime.from({ hour: 16 }),
      },
    },
    {
      type: "flohmarkt",
      comment: "Abbau",
      slot: {
        day: "SUNDAY",
        from: Temporal.PlainTime.from({ hour: 17 }),
        to: Temporal.PlainTime.from({ hour: 20 }),
      },
    },
  ],
  Rs: [
    {
      type: "transport",
      slot: {
        day: "FRIDAY",
        from: Temporal.PlainTime.from({ hour: 15 }),
        to: Temporal.PlainTime.from({ hour: 17 }),
      },
    },
    {
      type: "hall",
      slot: {
        day: "FRIDAY",
        from: Temporal.PlainTime.from({ hour: 17 }),
        to: Temporal.PlainTime.from({ hour: 22 }),
      },
    },
    {
      type: "okTop",
      slot: {
        day: "SATURDAY",
        from: Temporal.PlainTime.from({ hour: 10 }),
        to: Temporal.PlainTime.from({ hour: 12 }),
      },
    },
    {
      type: "okTop",
      slot: {
        day: "SATURDAY",
        from: Temporal.PlainTime.from({ hour: 14 }),
        to: Temporal.PlainTime.from({ hour: 16 }),
      },
    },
    {
      type: "okTop",
      slot: {
        day: "SATURDAY",
        from: Temporal.PlainTime.from({ hour: 18 }),
        to: Temporal.PlainTime.from({ hour: 20 }),
      },
    },
    {
      type: "okTop",
      slot: {
        day: "SATURDAY",
        from: Temporal.PlainTime.from({ hour: 22 }),
        to: Temporal.PlainTime.from({ hour: 0 }),
      },
    },
    {
      type: "okTop",
      slot: {
        day: "SUNDAY",
        from: Temporal.PlainTime.from({ hour: 14 }),
        to: Temporal.PlainTime.from({ hour: 16 }),
      },
    },
    {
      type: "kitchen",
      comment: "Abbau",
      slot: {
        day: "SUNDAY",
        from: Temporal.PlainTime.from({ hour: 17 }),
        to: Temporal.PlainTime.from({ hour: 20 }),
      },
    },
  ],
  Us: [
    {
      type: "purchase",
      slot: {
        day: "FRIDAY",
        from: Temporal.PlainTime.from({ hour: 12 }),
        to: Temporal.PlainTime.from({ hour: 16 }),
      },
    },
    {
      type: "setup",
      comment: "Koordination",
      slot: {
        day: "FRIDAY",
        from: Temporal.PlainTime.from({ hour: 16 }),
        to: Temporal.PlainTime.from({ hour: 22 }),
      },
    },
    {
      type: "kitchen",
      comment: "Verantwortung",
      slot: {
        day: "SATURDAY",
        from: Temporal.PlainTime.from({ hour: 10 }),
        to: Temporal.PlainTime.from({ hour: 0 }),
      },
    },
    {
      type: "kitchen",
      comment: "Verantwortung",
      slot: {
        day: "SUNDAY",
        from: Temporal.PlainTime.from({ hour: 10 }),
        to: Temporal.PlainTime.from({ hour: 17 }),
      },
    },
    {
      type: "kitchen",
      comment: "Abbau (Koordination)",
      slot: {
        day: "SUNDAY",
        from: Temporal.PlainTime.from({ hour: 17 }),
        to: Temporal.PlainTime.from({ hour: 20 }),
      },
    },
  ],
  Pw: [
    {
      type: "transport",
      slot: {
        day: "FRIDAY",
        from: Temporal.PlainTime.from({ hour: 15 }),
        to: Temporal.PlainTime.from({ hour: 17 }),
      },
    },
  ],
} satisfies OkEntries;

type Cell = {
  label: string;
  slot: HelpEntrySlot;
};

type GroupedTables = PerDay<Record<string, Cell[]>>;

function applyGrouping(
  entries: HelpEntry[],
  groupFilter: GroupFilterState,
): GroupedTables {
  const { FRIDAY, SATURDAY, SUNDAY } = Object.groupBy(
    entries,
    (entry) => entry.slot.day,
  );

  if (groupFilter === "byType") {
    return {
      FRIDAY: groupByType(FRIDAY ?? []),
      SATURDAY: groupByType(SATURDAY ?? []),
      SUNDAY: groupByType(SUNDAY ?? []),
    };
  }

  return {
    FRIDAY: groupByName(FRIDAY ?? []),
    SATURDAY: groupByName(SATURDAY ?? []),
    SUNDAY: groupByName(SUNDAY ?? []),
  };
}

function groupByType(entries: HelpEntry[]): Record<string, Cell[]> {
  return mapGroupBy(
    entries,
    (entry) => types[entry.type].title,
    (entries) =>
      entries.map((entry): Cell => {
        const comment =
          (entry.comment?.trim() ?? "").length > 0 ? `(${entry.comment})` : "";
        return {
          label: `${entry.name} ${comment}`.trim(),
          slot: entry.slot,
        };
      }),
  );
}

function groupByName(entries: HelpEntry[]): Record<string, Cell[]> {
  return mapGroupBy(
    entries,
    (entry) => entry.name,
    (entries) =>
      entries.map((entry): Cell => {
        const comment =
          (entry.comment?.trim() ?? "").length > 0 ? `(${entry.comment})` : "";
        return {
          label: `${types[entry.type].title} ${comment}`.trim(),
          slot: entry.slot,
        };
      }),
  );
}

function GroupFilter(props: {
  groupFilter: Accessor<GroupFilterState>;
  setGroupFilter: Setter<GroupFilterState>;
}): JSX.Element {
  return (
    <Box>
      <div style="display: flex; flex-wrap: wrap; gap: 1rem; justify-content: space-between;">
        <h5 style="margin: 0;">Groupieren nach</h5>
      </div>
      <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
        <Button
          label="Typ"
          kind={props.groupFilter() === "byType" ? "success" : "gray"}
          onClick={() => props.setGroupFilter("byType")}
        />
        <Button
          label="Person"
          kind={props.groupFilter() === "byName" ? "success" : "gray"}
          onClick={() => props.setGroupFilter("byName")}
        />
      </div>
    </Box>
  );
}
