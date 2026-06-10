import { Box } from "@common/components/Box";
import { createReactive, type Reactive } from "@common/utils/reactivity";
import { For, Show, type JSX } from "solid-js";
import type { Participating, Save } from "@rst/components/anmeldung/api/save";
import type {
  Program,
  ProgramPublicEntry,
} from "@rst/components/anmeldung/api/program";
import { TXT } from "@common/utils/texts";
import { Entry } from "@rst/components/anmeldung/components/Entry";
import { toRange, type PerDay, type ProgramDay } from "@common/utils/time";
import { Filters, type ActiveFilter } from "@common/components/Filter";
import { getDay } from "@rst/components/anmeldung/constant/time";
import { Temporal } from "@js-temporal/polyfill";

export function Programm(props: {
  save$: Reactive<Save>;
  programData: Program;
}): JSX.Element {
  return <ProgramView save={props.save$.get()} program={props.programData} />;
}

function ProgramView(props: { save: Save; program: Program }): JSX.Element {
  const $filters = createReactive<ActiveFilter>({
    day: null,
    tags: [],
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
        />
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
          <Show when={props.program.find((h) => h.hour === hour)}>
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
                          (r) => r.entryUuid === entry.uuid,
                        )}
                      />
                    )}
                  </For>
                </ul>
              </>
            )}
          </Show>
        )}
      </For>
    </Show>
  );
}
