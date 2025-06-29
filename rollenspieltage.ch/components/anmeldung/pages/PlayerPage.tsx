import { Box } from "@common/components/Box";
import { For, Match, Show, Switch, type JSX, type Resource } from "solid-js";
import type { ProgramEntryClient } from "@rst/components/anmeldung/api/program";
import type { Result } from "@rst/components/anmeldung/api/utils";
import type { PerDay } from "@rst/components/anmeldung/utils/time";
import { TXT } from "@rst/components/anmeldung/constant/texts";
import { DESCR_SHORT_MAX_CHAR } from "@rst/components/anmeldung/forms/validation";
import { ellipsis } from "@common/components/utils";
import { gameTags } from "../constant/tags";

export function PlayerPage(props: {
  program: Resource<Result<ProgramEntryClient[]>>;
  isDebugging: boolean;
}): JSX.Element {
  return (
    <Switch
      fallback={
        <Box type="danger">
          <p>
            Diese Seite ist leider noch nicht bereit. Komm bitte später nochmal
            zurück.
          </p>
        </Box>
      }
    >
      <Match when={props.isDebugging}>
        <Box type="danger">
          <p>WIP</p>
        </Box>
        <Show when={props.program()} fallback={<h1>loading</h1>}>
          {(program) => (
            <Show
              when={program().kind === "SUCCESS"}
              fallback={
                <Box type="danger">
                  <p>Programm konnte nicht geladen werden.</p>
                </Box>
              }
            >
              <ProgramOverview
                program={(program() as { data: ProgramEntryClient[] }).data}
              />
            </Show>
          )}
        </Show>
      </Match>
    </Switch>
  );
}

function ProgramOverview(props: {
  program: ProgramEntryClient[];
}): JSX.Element {
  const groupedAndSorted = sortByFromHour(groupByDay(props.program));
  return (
    <>
      <h3>Samstag</h3>
      <ul class="event-list" role="list">
        <For each={groupedAndSorted.SATURDAY}>
          {(entry) => <Entry entry={entry} />}
        </For>
      </ul>
      <h3>Sonntag</h3>
      <ul class="event-list" role="list">
        <For each={groupedAndSorted.SUNDAY}>
          {(entry) => <Entry entry={entry} />}
        </For>
      </ul>
    </>
  );
}

function groupByDay(
  program: ProgramEntryClient[],
): PerDay<ProgramEntryClient[]> {
  const grouped = Object.groupBy(program, (entry) => entry.slot.day);
  return {
    SATURDAY: grouped.SATURDAY ?? [],
    SUNDAY: grouped.SUNDAY ?? [],
  };
}

function sortByFromHour(
  program: PerDay<ProgramEntryClient[]>,
): PerDay<ProgramEntryClient[]> {
  function sort(a: ProgramEntryClient, b: ProgramEntryClient): number {
    const { from: fromA, to: toA } = a.slot;
    const { from: fromB, to: toB } = b.slot;
    return fromA === fromB ? toA - toB : fromA - fromB;
  }

  return {
    SATURDAY: program.SATURDAY.toSorted(sort),
    SUNDAY: program.SUNDAY.toSorted(sort),
  };
}

function Entry(props: { entry: ProgramEntryClient }): JSX.Element {
  const tagNames = props.entry.tags
    .map((t) => gameTags.find(({ name }) => name === t))
    .filter((t) => t !== undefined)
    .map(({ label }) => label);

  return (
    <li class={["event-entry"].join(" ")}>
      <h3 class="event-title">{props.entry.title}</h3>
      <div class="event-details">
        <div class="event-tags">
          <strong>System:</strong>
          {props.entry.system}
        </div>
        <div class="event-tags">
          <strong>Tag, Zeit:</strong>
          <span>
            {TXT.days[props.entry.slot.day]}, {props.entry.slot.from} -{" "}
            {props.entry.slot.to} Uhr
          </span>
        </div>
        <div class="event-tags">
          <strong>Freie Plätze:</strong>{" "}
          {Math.max(
            props.entry.playerCount.max - 1 - props.entry.playerCount.reserved,
            0,
          )}
        </div>{" "}
        <div class="event-tags">
          <strong>Kategorien:</strong> {tagNames.join(", ")}
        </div>
      </div>
      <div class="event-description content">
        <p>
          <strong>Kurzbeschreibung:</strong>
          <br />
          {ellipsis(props.entry.description.short, DESCR_SHORT_MAX_CHAR)}
        </p>
      </div>
      <ul role="list" class="event-links">
        <li>
          <button
            onClick={() => console.log("not yet implemented")}
            class="event-link"
          >
            <span>Teilnehmen</span>
          </button>
        </li>
        <li>
          <button
            onClick={() => console.log("not yet implemented")}
            class="event-link"
          >
            <span>Details</span>
          </button>
        </li>
      </ul>
    </li>
  );
}
