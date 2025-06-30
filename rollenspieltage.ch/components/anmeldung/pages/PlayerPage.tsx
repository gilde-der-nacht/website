import { Box } from "@common/components/Box";
import {
  createEffect,
  For,
  Match,
  Show,
  Switch,
  type JSX,
  type Resource,
} from "solid-js";
import type { ProgramEntryClient } from "@rst/components/anmeldung/api/program";
import type { Result } from "@rst/components/anmeldung/api/utils";
import type { PerDay } from "@rst/components/anmeldung/utils/time";
import { TXT } from "@rst/components/anmeldung/constant/texts";
import { DESCR_SHORT_MAX_CHAR } from "@rst/components/anmeldung/forms/validation";
import { ellipsis } from "@common/components/utils";
import { gameTags } from "@rst/components/anmeldung/constant/tags";
import type { ChangePageFn } from "@rst/components/anmeldung/Router";
import { Dialog, initDialogStore } from "@common/components/Dialog";
import { createStore } from "solid-js/store";

export function PlayerPage(props: {
  program: Resource<Result<ProgramEntryClient[]>>;
  uuid: string | null;
  changePage: ChangePageFn;
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
                uuid={props.uuid}
                changePage={props.changePage}
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
  uuid: string | null;
  changePage: ChangePageFn;
}): JSX.Element {
  const [dialogStore, setDialogStore] = createStore(
    initDialogStore(props.uuid !== undefined),
  );
  createEffect(() => {
    setDialogStore("open", props.uuid !== null);
  });

  const selectedEntry = (): ProgramEntryClient | undefined => {
    return props.program.find((entry) => entry.uuid === props.uuid);
  };

  const groupedAndSorted = sortByFromHour(groupByDay(props.program));
  return (
    <>
      <Show when={selectedEntry()}>
        {(entry) => (
          <Dialog
            store={dialogStore}
            title={entry().title}
            onClose={() => {
              return props.changePage(
                { kind: "PLAYER" },
                { disableScroll: true },
              );
            }}
            size="medium"
          >
            <p>{entry().description.short}</p>
          </Dialog>
        )}
      </Show>
      <br />
      <h3>Samstag</h3>
      <br />
      <ul class="event-list max" role="list">
        <For
          each={groupedAndSorted.SATURDAY}
          fallback={<Box>Keine Spielrunden gefunden.</Box>}
        >
          {(entry) => <Entry entry={entry} changePage={props.changePage} />}
        </For>
      </ul>
      <br />
      <br />
      <h3>Sonntag</h3>
      <br />
      <ul class="event-list max" role="list">
        <For
          each={groupedAndSorted.SUNDAY}
          fallback={<Box>Keine Spielrunden gefunden.</Box>}
        >
          {(entry) => <Entry entry={entry} changePage={props.changePage} />}
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

function Entry(props: {
  entry: ProgramEntryClient;
  changePage: ChangePageFn;
}): JSX.Element {
  const tagNames = props.entry.tags
    .map((t) => gameTags.find(({ name }) => name === t))
    .filter((t) => t !== undefined)
    .map(({ label }) => label);

  return (
    <li class={["event-entry"].join(" ")}>
      <h3 class="event-title">{props.entry.title}</h3>
      <div class="event-details">
        <div class="event-tags">
          <strong>Spielleitung:</strong>
          {props.entry.gamemaster}
        </div>
        <div class="event-tags">
          <strong>System:</strong>
          {props.entry.system.trim().length > 0 ? (
            props.entry.system
          ) : (
            <em>kein System angegeben</em>
          )}
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
          )}{" "}
          (von {props.entry.playerCount.max - 1})
        </div>{" "}
        <div class="event-tags">
          <strong>Kategorien:</strong>{" "}
          {tagNames.length > 0 ? (
            tagNames.join(", ")
          ) : (
            <em>keine Kategorien</em>
          )}
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
            onClick={() =>
              props.changePage(
                {
                  kind: "GAME",
                  uuid: props.entry.uuid,
                },
                {
                  disableScroll: true,
                },
              )
            }
            class="event-link"
          >
            <span>Details & Teilnehmen</span>
          </button>
        </li>
      </ul>
    </li>
  );
}
