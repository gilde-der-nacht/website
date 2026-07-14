import { Box } from "@common/components/Box";
import { createReactive, type Reactive } from "@common/utils/reactivity";
import { For, Match, Show, Switch, type Accessor, type JSX } from "solid-js";
import type { ReserveAction, Save } from "@rst/components/anmeldung/api/save";
import type {
  Program,
  ProgramHiddenEntry,
  ProgramPublicEntry,
} from "@rst/components/anmeldung/api/program";
import { TXT } from "@common/utils/texts";
import { Entry } from "@rst/components/anmeldung/components/Entry";
import { toRange, type PerDay, type ProgramDay } from "@common/utils/time";
import { Filters, type ActiveFilter } from "@common/components/Filter";
import { getDay, openingHours } from "@rst/components/anmeldung/constant/time";
import { Temporal } from "@js-temporal/polyfill";
import type { Roles } from "@rst/components/anmeldung/api/meta";
import { UNAUTHORIZED } from "@common/utils/shared";
import { BoxLink } from "@common/components/BoxLink";
import { Chip } from "@common/components/Chip";
import { MealBreak } from "@rst/components/anmeldung/components/MealBreak";
import {
  BrowserLink,
  RouterLink,
  type LinkComponent,
} from "@common/components/Link";
import {
  getBookedEntries,
  getConflicts,
} from "@rst/components/anmeldung/utils/conflict";
import type { RegistrationUuid } from "@common/utils/ids";
import "core-js/full/object/group-by";
import "core-js/proposals/set-methods-v2";

export function Programm(props: {
  save$: Reactive<Save>;
  programData: Accessor<Program>;
  roles: Roles;
  secret: RegistrationUuid;
}): JSX.Element {
  return (
    <ProgramView
      save$={props.save$}
      program={props.programData}
      roles={props.roles}
      isPublicSite={false}
      link={RouterLink}
      secret={props.secret}
    />
  );
}

export function PublicProgramm(props: {
  programData: Accessor<Program>;
}): JSX.Element {
  return (
    <ProgramView
      save$={null}
      program={props.programData}
      roles={[]}
      isPublicSite={true}
      link={BrowserLink}
      secret={null}
    />
  );
}

function ProgramView(props: {
  save$: Reactive<Save> | null;
  program: Accessor<Program>;
  roles: Roles;
  isPublicSite: boolean;
  link: LinkComponent;
  secret: RegistrationUuid | null;
}): JSX.Element {
  const filters$ = createReactive<ActiveFilter>({
    day: null,
    tags: [],
    language: null,
  });

  const program = () =>
    filterSortGroupProgram(props.program().publicEntries, filters$);

  const tags = Object.entries(
    Object.groupBy(
      props.program().publicEntries.flatMap((e) => e.tagNames),
      (e) => e,
    ),
  )
    .filter(([tag, list]) => list !== undefined && tag.trim().length > 0)
    .map(([tag, list]) => ({
      label: tag,
      name: tag,
      count: list?.length ?? 0,
    }))
    .toSorted((a, b) => {
      const ageRegex = /^([^\d]+)\s(\d+?)[^\d]*$/;
      const aExec = ageRegex.exec(a.name);
      const bExec = ageRegex.exec(b.name);
      if (aExec !== null && bExec !== null) {
        const aNum = Number(aExec[2]);
        const bNum = Number(bExec[2]);
        if (!isNaN(aNum) && !isNaN(bNum)) {
          return aNum - bNum;
        }
      }
      return a.name.localeCompare(b.name);
    });

  function getHiddenEntriesEmptyIfUnauthorized(): ProgramHiddenEntry[] {
    const { hiddenEntries } = props.program();
    return hiddenEntries === UNAUTHORIZED ? [] : hiddenEntries;
  }

  return (
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <Filters filters$={filters$} tags={tags} />
      <Show
        when={filters$.get().day === "SATURDAY" || filters$.get().day === null}
      >
        <h3>Samstag</h3>
        <DayProgram
          day="SATURDAY"
          programByHours={program().SATURDAY}
          myReservationActions={props.save$?.get().program.reserveActions ?? []}
          roles={props.roles}
          isPublicSite={props.isPublicSite}
          link={props.link}
          secret={props.secret}
        />
      </Show>
      <Show
        when={filters$.get().day === "SUNDAY" || filters$.get().day === null}
      >
        <h3>Sonntag</h3>
        <DayProgram
          day="SUNDAY"
          programByHours={program().SUNDAY}
          myReservationActions={props.save$?.get().program.reserveActions ?? []}
          roles={props.roles}
          isPublicSite={props.isPublicSite}
          link={props.link}
          secret={props.secret}
        />
      </Show>
      <Show when={props.roles.includes("admin")}>
        <h3>Entwürfe / Veröffentlicht mit Fehlern</h3>
        <ul class="link-list" role="list">
          <For each={getHiddenEntriesEmptyIfUnauthorized()}>
            {(entry) => (
              <li>
                <a
                  href={`/meine-anmeldung/#/erstellen/${entry.uuid}?secret=${entry.secretForEditing}`}
                  target="_blank"
                  class="button-link"
                >
                  <BoxLink
                    icon="arrow-right"
                    type={entry.status === "published" ? "danger" : "special"}
                  >
                    <h3>
                      {entry.title.trim().length === 0
                        ? "[Titel fehlt noch]"
                        : entry.title}
                    </h3>
                    <span style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                      <Chip kind={"special"}>
                        Spielleitung: {entry.organizer}
                      </Chip>
                      <Chip kind={"special"}>
                        Status: {TXT.publishingSteps[entry.status]}{" "}
                        {entry.status === "published" ? "(mit Fehlern)" : ""}
                      </Chip>
                    </span>
                  </BoxLink>
                </a>
              </li>
            )}
          </For>
        </ul>
      </Show>
    </div>
  );
}

type HourProgram = { hour: number; entries: ProgramPublicEntry[] };

function filterSortGroupProgram(
  entries: ProgramPublicEntry[],
  filters$: Reactive<ActiveFilter>,
): PerDay<HourProgram[]> {
  const filters = filters$.get();
  const days: PerDay<HourProgram[]> = {
    FRIDAY: [],
    SATURDAY: [],
    SUNDAY: [],
  };

  entries.forEach((entry) => {
    if (
      filters.tags.length !== 0 &&
      !new Set(filters.tags).isSubsetOf(
        new Set(entry.tagNames.map((s) => s.trim())),
      )
    ) {
      return;
    }

    if (filters.language !== null) {
      if (filters.language !== entry.language) {
        return;
      }
    }

    const day = getDay(entry.timeSlot.slot.start.day);
    if (day === null) {
      return;
    }
    const startHour = Temporal.PlainTime.from(
      entry.timeSlot.slot.start.time,
    ).hour;

    const found = days[day].find((hour) => hour.hour === startHour);
    if (found === undefined) {
      days[day].push({
        hour: startHour,
        entries: [entry],
      });
    } else {
      found.entries.push(entry);
    }
  });

  return {
    FRIDAY: sort(days.FRIDAY),
    SATURDAY: sort(days.SATURDAY),
    SUNDAY: sort(days.SUNDAY),
  };
}

function sort(programm: HourProgram[]): HourProgram[] {
  return programm
    .map((hour) => ({
      hour: hour.hour,
      entries: hour.entries.toSorted(
        (a, b) =>
          Temporal.PlainTime.compare(
            a.timeSlot.slot.start.time,
            b.timeSlot.slot.start.time,
          ) || a.timeSlot.slot.duration.hours - b.timeSlot.slot.duration.hours,
      ),
    }))
    .toSorted((a, b) => a.hour - b.hour);
}

export function DayProgram(props: {
  day: ProgramDay;
  programByHours: HourProgram[];
  myReservationActions: ReserveAction[];
  roles: Roles;
  isPublicSite: boolean;
  link: LinkComponent;
  secret: RegistrationUuid | null;
}): JSX.Element {
  const myBookedHours = getBookedEntries(
    props.programByHours.flatMap((hour) => hour.entries),
    props.secret,
  );

  return (
    <Show
      when={props.programByHours.length > 0}
      fallback={
        <>
          <Box>
            Keine Spielrunden mit den ausgewählten Filtern am{" "}
            {TXT.days[props.day]} gefunden.
          </Box>
        </>
      }
    >
      <For each={toRange(24)}>
        {(hour) => (
          <Switch>
            <Match
              when={openingHours[props.day].breaks.find(
                ({ from }) => from === hour,
              )}
            >
              <MealBreak
                from={hour}
                to={hour + 1}
                title={hour === 13 ? "Mittagessen" : "Nachtessen"}
              />
            </Match>
            <Match when={props.programByHours.find((h) => h.hour === hour)}>
              {(hourProgram) => (
                <>
                  <h4>Start: {hour} Uhr</h4>
                  <ul role="list" class="event-list">
                    <For each={hourProgram().entries}>
                      {(entry) => (
                        <Entry
                          entry={entry}
                          conflictsWith={getConflicts(entry, myBookedHours)}
                          basePath="/programm"
                          roles={props.roles}
                          isPublicSite={props.isPublicSite}
                          link={props.link}
                          secret={props.secret}
                        />
                      )}
                    </For>
                  </ul>
                </>
              )}
            </Match>
          </Switch>
        )}
      </For>
    </Show>
  );
}
