import { Box } from "@common/components/Box";
import {
  createEffect,
  For,
  Match,
  Show,
  Suspense,
  Switch,
  type JSX,
  type Resource,
} from "solid-js";
import type { ProgramEntryClient } from "@rst/components/anmeldung/api/program";
import type { Result } from "@rst/components/anmeldung/api/utils";
import {
  getHours,
  type PerDay,
  type ProgramDay,
} from "@rst/components/anmeldung/utils/time";
import { TXT } from "@rst/components/anmeldung/constant/texts";
import { DESCR_SHORT_MAX_CHAR } from "@rst/components/anmeldung/forms/validation";
import { ellipsis } from "@common/components/utils";
import { gameTags } from "@rst/components/anmeldung/constant/tags";
import type { ChangePageFn } from "@rst/components/anmeldung/Router";
import { Dialog, initDialogStore } from "@common/components/Dialog";
import { createStore, type Store } from "solid-js/store";
import { openingHours } from "@rst/components/anmeldung/constant/hours";
import { GameDialog } from "@rst/components/anmeldung/components/GameDialog";
import type {
  ReservationClient,
  ReservationCreateClient,
} from "@rst/components/anmeldung/api/save";

export function PlayerPage(props: {
  program: Resource<Result<ProgramEntryClient[]>>;
  reservations: Store<ReservationClient[]>;
  addReservation: (reservation: ReservationCreateClient) => void;
  removeReservation: (reservationUuid: string) => void;
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
        <br />
        <Suspense fallback={<Box>{TXT.loading.program}</Box>}>
          <Show
            when={props.program()}
            fallback={<Box type="danger">{TXT.error.program}</Box>}
          >
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
                  reservations={props.reservations}
                  addReservation={props.addReservation}
                  removeReservation={props.removeReservation}
                  uuid={props.uuid}
                  changePage={props.changePage}
                />
              </Show>
            )}
          </Show>
        </Suspense>
      </Match>
    </Switch>
  );
}

function ProgramOverview(props: {
  program: ProgramEntryClient[];
  reservations: ReservationClient[];
  addReservation: (reservation: ReservationCreateClient) => void;
  removeReservation: (reservationUuid: string) => void;
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
            size="large"
          >
            <GameDialog
              entry={entry()}
              reservations={props.reservations}
              addReservation={props.addReservation}
              removeReservation={props.removeReservation}
            />
          </Dialog>
        )}
      </Show>
      <br />
      <ProgramOfDay
        day="SATURDAY"
        programOfDay={groupedAndSorted.SATURDAY}
        changePage={props.changePage}
      />
      <br />
      <br />
      <ProgramOfDay
        day="SUNDAY"
        programOfDay={groupedAndSorted.SUNDAY}
        changePage={props.changePage}
      />
    </>
  );
}

function ProgramOfDay(props: {
  day: ProgramDay;
  programOfDay: Record<number, ProgramEntryClient[]>;
  changePage: ChangePageFn;
}): JSX.Element {
  const breaks = openingHours[props.day].breaks;
  const breakStarts = breaks.map((b) => b.from);
  const getType = (start: number) =>
    breakStarts.indexOf(start) === 0 ? "LUNCH" : "DINNER";

  return (
    <>
      <h3>{TXT.days[props.day]}</h3>
      <For
        each={Object.entries(props.programOfDay)}
        fallback={<Box>Keine Spielrunden gefunden.</Box>}
      >
        {([hour, entries]) =>
          breakStarts.includes(Number(hour)) ? (
            <Break
              type={getType(Number(hour))}
              range={{ from: Number(hour), to: Number(hour) - 1 }}
            />
          ) : entries.length === 0 ? null : (
            <>
              <h4 style="margin-block-start: 2rem; margin-block-end: 1rem;">
                Start: {hour} Uhr
              </h4>
              <ul class="event-list max" role="list">
                <For each={entries}>
                  {(entry) => (
                    <Entry entry={entry} changePage={props.changePage} />
                  )}
                </For>
              </ul>
            </>
          )
        }
      </For>
    </>
  );
}

function Break(props: {
  type: "LUNCH" | "DINNER";
  range: { from: number; to: number };
}): JSX.Element {
  const title = props.type === "LUNCH" ? "Mittagessen" : "Nachtessen";
  const menu =
    "Pilzrisotto (vegi&nbsp;/&nbsp;vegan), Penne All'Arrabbiata und Penne Pesto (vegi&nbsp;/&nbsp;vegan).";
  return (
    <div style="margin-block-start: 2rem;">
      <Box>
        <small>
          {props.range.from} - {props.range.to} Uhr
        </small>
        <h4 style="margin-block-end: 0.5rem;">{title}</h4>
        <p>
          Wir kochen: <span innerHTML={menu}></span>
        </p>
      </Box>
    </div>
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
): PerDay<Record<number, ProgramEntryClient[]>> {
  function sort(a: ProgramEntryClient, b: ProgramEntryClient): number {
    const { from: fromA, to: toA } = a.slot;
    const { from: fromB, to: toB } = b.slot;
    return fromA === fromB ? toA - toB : fromA - fromB;
  }
  const saturdaySorted = program.SATURDAY.toSorted(sort);
  const sundaySorted = program.SUNDAY.toSorted(sort);

  const saturdayByHours = getHours(openingHours.SATURDAY.open).reduce<
    Record<number, ProgramEntryClient[]>
  >((acc, hour) => {
    acc[hour] = saturdaySorted.filter((entry) => entry.slot.from === hour);
    return acc;
  }, {});
  const sundayByHours = getHours(openingHours.SUNDAY.open).reduce<
    Record<number, ProgramEntryClient[]>
  >((acc, hour) => {
    acc[hour] = sundaySorted.filter((entry) => entry.slot.from === hour);
    return acc;
  }, {});

  return {
    SATURDAY: saturdayByHours,
    SUNDAY: sundayByHours,
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
