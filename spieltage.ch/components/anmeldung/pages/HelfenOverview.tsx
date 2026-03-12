import {
  createSignal,
  For,
  Show,
  type Accessor,
  type JSX,
  type Setter,
} from "solid-js";
import type { HelpingReservation } from "@lst/components/anmeldung/api/save";
import type { Roles } from "@lst/components/anmeldung/api/meta";
import { DayFilter, type DayFilterState } from "@common/components/Filter";
import type { Reactive } from "@common/utils/reactivity";
import { Box } from "@common/components/Box";
import type {
  AdminHelpEntry,
  AdminHelpEntryA,
  Constants,
  ErklaerbaerAdminEntry,
  PublicAdmin,
} from "@lst/components/anmeldung/api/admin";
import {
  helpTimes,
  helpTypes,
  type HelpType,
} from "@lst/components/anmeldung/constant/helping";
import { assert } from "@common/components/utils";
import { getDay } from "@lst/components/anmeldung/constant/time";
import { Temporal } from "@js-temporal/polyfill";
import type { PerDay, ProgramDay } from "@common/utils/time";
import { parsePlainTime } from "@common/components/events";
import { Button } from "@common/components/Button";
import { mapGroupBy } from "@common/utils/group";

type GroupFilterState = "byName" | "byType";

export function HelfenOverview(props: {
  reservations$: Reactive<HelpingReservation[]>;
  adminData: PublicAdmin;
  roles: Roles;
}): JSX.Element {
  const [dayFilter, setDayFilter] = createSignal<DayFilterState>(null);
  const [groupFilter, setGroupFilter] =
    createSignal<GroupFilterState>("byType");

  const { admin, erklaerbaer } = props.adminData;
  if (erklaerbaer === null) {
    return <Box type="danger">Du hast keinen Zugriff auf diesen Bereich.</Box>;
  }

  if (admin === null) {
    return <Box type="danger">Du hast keinen Zugriff auf diesen Bereich.</Box>;
  }

  const entries = normalizeEntries(
    erklaerbaer.entries,
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
      <Show
        when={props.roles.includes("admin")}
        fallback={
          <Box type="danger">Du hast keinen Zugriff auf diesen Bereich.</Box>
        }
      >
        <Content
          adminData={props.adminData}
          entries={entries}
          dayFilter={dayFilter}
          groupFilter={groupFilter}
        />
      </Show>
    </>
  );
}

function Content(props: {
  adminData: PublicAdmin;
  entries: HelpEntry[];
  dayFilter: Accessor<DayFilterState>;
  groupFilter: Accessor<GroupFilterState>;
}): JSX.Element {
  const g = () => applyGrouping(props.entries, props.groupFilter());

  const { admin } = props.adminData;

  if (admin === null) {
    return null;
  }

  const { help } = admin;

  const grouped = groupHelp(help);

  const helpTypesIds = Object.keys(helpTypes) as HelpType[];

  return (
    <>
      <code>
        <pre>{JSON.stringify(g(), null, 2)}</pre>
      </code>
      <br />
      <ul role="list" class="link-list">
        <For each={helpTypesIds}>
          {(helpTypeId) => (
            <Show
              when={
                grouped[helpTypeId] !== undefined &&
                grouped[helpTypeId].length > 0
              }
            >
              <li>
                <h3>{helpTypes[helpTypeId].title}</h3>
                <code>
                  <pre>{JSON.stringify(grouped[helpTypeId], null, 2)}</pre>
                </code>
              </li>
            </Show>
          )}
        </For>
        <li>
          <h3>Erklärbären</h3>
          <code>
            <pre>{JSON.stringify(grouped.erklaerbaer, null, 2)}</pre>
          </code>
        </li>
      </ul>
    </>
  );
}

function groupHelp(
  help: AdminHelpEntry[],
): Partial<Record<string, AdminHelpEntryA[]>> {
  const aggregated = help
    .map((entry) => {
      if ("ref" in entry) {
        const found = helpTimes.find((h) => h.uuid === entry.ref);
        assert(
          found !== undefined,
          `No help time found with uuid '${entry.ref}'`,
        );
        return {
          meta: entry,
          found,
        };
      } else {
        return entry;
      }
    })
    .map((entry): AdminHelpEntryA => {
      if ("meta" in entry) {
        return {
          uuid: entry.meta.uuid,
          name: entry.meta.name,
          helpType: entry.found.kind,
          slot: {
            start: {
              day: getDay(entry.found.dateTime.startDate) ?? "FRIDAY",
              time: entry.found.dateTime.startDate.toPlainTime().toJSON(),
            },
            end: {
              day: getDay(entry.found.dateTime.endDate) ?? "FRIDAY",
              time: entry.found.dateTime.endDate.toPlainTime().toJSON(),
            },
          },
        };
      } else {
        return entry;
      }
    });
  return Object.groupBy(aggregated, (e) => e.helpType);
}

const types = {
  ...helpTypes,
  transport: { title: "Transport" },
  purchase: { title: "Einkauf" },
  hall: { title: "Saal einrichten" },
  erklaerbaer: { title: "Erklärbären" },
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
  erklaerbaer: ErklaerbaerAdminEntry[],
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
      erklaerbaer.map(
        (entry): HelpEntry => ({
          name: entry.name,
          type: "erklaerbaer",
          slot: {
            day: entry.slot.day,
            from: Temporal.PlainTime.from({ hour: entry.slot.from }),
            to: Temporal.PlainTime.from({ hour: entry.slot.to }),
          },
        }),
      ),
    )
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
        to: Temporal.PlainTime.from({ hour: 0 }),
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
        to: Temporal.PlainTime.from({ hour: 0 }),
      },
    },
  ],
  Ts: [
    {
      type: "flohmarkt",
      slot: {
        day: "FRIDAY",
        from: Temporal.PlainTime.from({ hour: 19 }),
        to: Temporal.PlainTime.from({ hour: 0 }),
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
        to: Temporal.PlainTime.from({ hour: 0 }),
      },
    },
  ],
  Mm: [
    {
      type: "hall",
      slot: {
        day: "FRIDAY",
        from: Temporal.PlainTime.from({ hour: 19 }),
        to: Temporal.PlainTime.from({ hour: 0 }),
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
        to: Temporal.PlainTime.from({ hour: 0 }),
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
        to: Temporal.PlainTime.from({ hour: 0 }),
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
        to: Temporal.PlainTime.from({ hour: 0 }),
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
