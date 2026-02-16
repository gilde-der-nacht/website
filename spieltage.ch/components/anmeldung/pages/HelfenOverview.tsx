import { createSignal, For, Show, type JSX, type Resource } from "solid-js";
import type { HelpingReservation } from "@lst/components/anmeldung/api/save";
import type { Roles } from "@lst/components/anmeldung/api/meta";
import type { Result } from "@lst/components/anmeldung/api/elysium";
import { DayFilter, type DayFilterState } from "@common/components/Filter";
import type { Reactive } from "@common/utils/reactivity";
import { Box } from "@common/components/Box";
import type {
  AdminHelpEntry,
  AdminHelpEntryA,
  PublicAdmin,
} from "@lst/components/anmeldung/api/admin";
import {
  helpTimes,
  helpTypes,
  type HelpType,
} from "@lst/components/anmeldung/constant/helping";
import { assert } from "@common/components/utils";
import { getDay } from "@lst/components/anmeldung/constant/time";

export function HelfenOverview(props: {
  reservations$: Reactive<HelpingReservation[]>;
  adminResource: Resource<Result<PublicAdmin>>;
  link: (path: string) => string;
  roles: Roles;
}): JSX.Element {
  return (
    <>
      <Show
        when={props.roles.includes("admin")}
        fallback={
          <Box type="danger">Du hast keinen Zugriff auf diesen Bereich.</Box>
        }
      >
        <Show when={props.adminResource()}>
          {(resource) => <Content adminResource={resource()} />}
        </Show>
      </Show>
    </>
  );
}

function Content(props: { adminResource: Result<PublicAdmin> }): JSX.Element {
  const [dayFilter, setDayFilter] = createSignal<DayFilterState>(null);

  if (props.adminResource.kind === "FAILURE") {
    return null;
  }

  const { admin } = props.adminResource.data;

  if (admin === null) {
    return null;
  }

  const { help } = admin;

  const grouped = groupHelp(help);

  const helpTypesIds = Object.keys(helpTypes) as HelpType[];

  return (
    <>
      <DayFilter dayFilter={dayFilter} setDayFilter={setDayFilter} />
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
