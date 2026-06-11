import { Box } from "@common/components/Box";
import { createReactive, type Reactive } from "@common/utils/reactivity";
import { For, Match, Show, Switch, type JSX } from "solid-js";
import type { Participating, Save } from "@rst/components/anmeldung/api/save";
import type {
  Program,
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
import { MealBreak } from "../components/MealBreak";

export function Programm(props: {
  save$: Reactive<Save>;
  programData: Program;
  roles: Roles;
}): JSX.Element {
  return (
    <ProgramView
      save={props.save$.get()}
      program={props.programData}
      roles={props.roles}
    />
  );
}

function ProgramView(props: {
  save: Save;
  program: Program;
  roles: Roles;
}): JSX.Element {
  const $filters = createReactive<ActiveFilter>({
    day: null,
    tags: [],
    language: null,
  });

  const program = () =>
    filterSortGroupProgram(props.program.publicEntries, $filters);

  const tags = new Set(
    props.program.publicEntries.flatMap((entry) =>
      entry.tagNames.map((s) => s.trim()).filter((s) => s.length !== 0),
    ),
  );

  return (
    <>
      <Filters
        filters$={$filters}
        tags={[...tags].toSorted().map((tag) => ({ label: tag, name: tag }))}
      />
      <br />
      <Show
        when={$filters.get().day === "SATURDAY" || $filters.get().day === null}
      >
        <h3>Samstag</h3>
        <DayProgram
          day="SATURDAY"
          program={program().SATURDAY}
          myReservations={props.save.program.reserved}
          roles={props.roles}
        />
        <br />
      </Show>
      <Show
        when={$filters.get().day === "SUNDAY" || $filters.get().day === null}
      >
        <h3>Sonntag</h3>
        <DayProgram
          day="SUNDAY"
          program={program().SUNDAY}
          myReservations={props.save.program.reserved}
          roles={props.roles}
        />
      </Show>
      <Show when={props.roles.includes("admin")}>
        <br />
        <h3>Entwürfe / Veröffentlicht mit Fehlern</h3>
        <br />
        <ul class="link-list" role="list">
          <For
            each={
              props.program.hiddenEntries !== UNAUTHORIZED
                ? props.program.hiddenEntries
                : []
            }
          >
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
    </>
  );
}

type HourProgram = { hour: number; entries: ProgramPublicEntry[] };

function filterSortGroupProgram(
  entries: ProgramPublicEntry[],
  $filters: Reactive<ActiveFilter>,
): PerDay<HourProgram[]> {
  const filters = $filters.get();
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
  program: HourProgram[];
  myReservations: Participating[];
  roles: Roles;
}): JSX.Element {
  return (
    <Show
      when={props.program.length > 0}
      fallback={
        <>
          <br />
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
              <br />
              <MealBreak
                from={hour}
                to={hour + 1}
                title={hour === 13 ? "Mittagessen" : "Nachtessen"}
              />
            </Match>
            <Match when={props.program.find((h) => h.hour === hour)}>
              {(hourProgram) => (
                <>
                  <h4 style="margin-block-start: 2rem; margin-block-end: 1rem;">
                    Start: {hour} Uhr
                  </h4>
                  <ul role="list" class="event-list">
                    <For each={hourProgram().entries}>
                      {(entry) => (
                        <Entry
                          entry={entry}
                          basePath="/programm"
                          additionalReservations={props.myReservations.filter(
                            (r) => r.entryUuid === entry.timeSlot.uuid,
                          )}
                          roles={props.roles}
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
