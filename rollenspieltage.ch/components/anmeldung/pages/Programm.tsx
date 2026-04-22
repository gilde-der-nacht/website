import { Box } from "@common/components/Box";
import { createReactive, type Reactive } from "@common/utils/reactivity";
import { For, Show, type JSX } from "solid-js";
import type { Reservation, Save } from "@rst/components/anmeldung/api/save";
import type {
  Public,
  PublicProgramEntry,
} from "@rst/components/anmeldung/api/public";
import { TXT } from "@common/utils/texts";
import { Entry } from "@rst/components/anmeldung/components/Entry";
import { toRange, type PerDay, type ProgramDay } from "@common/utils/time";
import { Filters, type ActiveFilter } from "@common/components/Filter";
import { getDay } from "../constant/time";
import { Temporal } from "@js-temporal/polyfill";

export function Programm(props: {
  save$: Reactive<Save>;
  publicData: Public;
}): JSX.Element {
  return (
    <ProgramView save={props.save$.get()} publicState={props.publicData} />
  );
}

function ProgramView(props: { save: Save; publicState: Public }): JSX.Element {
  const $filters = createReactive<ActiveFilter>({
    day: null,
    tags: [],
  });

  const program = () =>
    filterSortGroupProgram(props.publicState.programEntries, $filters);

  const tags = new Set(
    props.publicState.programEntries.flatMap((entry) =>
      entry.tagNames
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length !== 0),
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
          myReservations={props.save.program.participating}
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
          myReservations={props.save.program.participating}
        />
      </Show>
    </>
  );
}

type HourProgram = { hour: number; entries: PublicProgramEntry[] };

function filterSortGroupProgram(
  entries: PublicProgramEntry[],
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
        new Set(entry.tagNames.split(",").map((s) => s.trim())),
      )
    ) {
      return;
    }

    const day = getDay(entry.slot.day);
    if (day === null) {
      return;
    }
    const startHour = entry.slot.start.hour;

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
          Temporal.PlainTime.compare(a.slot.start, b.slot.start) ||
          Temporal.PlainTime.compare(a.slot.end, b.slot.end),
      ),
    }))
    .toSorted((a, b) => a.hour - b.hour);
}

export function DayProgram(props: {
  day: ProgramDay;
  program: HourProgram[];
  myReservations: Reservation[];
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
