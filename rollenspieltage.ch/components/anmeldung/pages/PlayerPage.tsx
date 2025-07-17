import { Box } from "@common/components/Box";
import {
  createEffect,
  For,
  Show,
  Suspense,
  type JSX,
  type Resource,
} from "solid-js";
import {
  groupByDay,
  sortByFromHour,
  type ProgramEntryClient,
} from "@rst/components/anmeldung/api/program";
import type { Result } from "@rst/components/anmeldung/api/utils";
import { type ProgramDay } from "@rst/components/anmeldung/utils/time";
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
  PlayingClient,
  ReservationClient,
  ReservationCreateClient,
} from "@rst/components/anmeldung/api/save";
import { Checkbox } from "@common/components/Checkbox";
import {
  applyFilter,
  Filters,
  initalizeFilters,
  type ActiveFilter,
} from "@rst/components/anmeldung/components/Filter";

export function PlayerPage(props: {
  store: Store<PlayingClient>;
  program: Resource<Result<ProgramEntryClient[]>>;
  uuid: string | null;
  isEditable: boolean;
  changePage: ChangePageFn;
}): JSX.Element {
  const [store, setStore] = createStore({
    playing: props.store,
    activeFilter: initalizeFilters(),
    categoryDialog: initDialogStore(),
  });

  return (
    <>
      <Checkbox
        label="Schickt mir bitte E-Mails, wenn neue Spielrunden veröffentlicht werden."
        checked={store.playing.wantsUpdates}
        name="wantsUpdates"
        value="wantsUpdates"
        onValueUpdate={(checked) => {
          setStore("playing", "wantsUpdates", checked);
        }}
      />
      <br />
      <Filters
        activeFilter={store.activeFilter}
        showExplanationOfCategories={() =>
          setStore("categoryDialog", "open", true)
        }
      />
      <Dialog
        store={store.categoryDialog}
        title="Erklärungen der Kategorien"
        onClose={() => {}}
        size="medium"
      >
        <ul style="padding: 0; padding-block-start: 1rem; margin: 0; max-inline-size: 100%; display: grid; gap: 0.5rem;">
          {gameTags.map((t) => (
            <li>
              <strong>{t.label}</strong>
              <br />
              <p>{t.description}</p>
            </li>
          ))}
        </ul>
      </Dialog>
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
                filter={store.activeFilter}
                reservations={store.playing.reservations}
                isEditable={props.isEditable}
                addReservation={(reservation) =>
                  setStore(
                    "playing",
                    "reservations",
                    store.playing.reservations.length,
                    {
                      ...reservation,
                      uuid: crypto.randomUUID(),
                    },
                  )
                }
                removeReservation={(reservationUuid) => {
                  setStore(
                    "playing",
                    "reservations",
                    store.playing.reservations.filter(
                      (r) => r.uuid !== reservationUuid,
                    ),
                  );
                }}
                uuid={props.uuid}
                changePage={props.changePage}
              />
            </Show>
          )}
        </Show>
      </Suspense>
    </>
  );
}

function ProgramOverview(props: {
  program: ProgramEntryClient[];
  reservations: ReservationClient[];
  filter: ActiveFilter;
  isEditable: boolean;
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

  const getFilteredProgram = () => applyFilter(props.program, props.filter);

  const getGroupedAndSorted = () =>
    sortByFromHour(groupByDay(getFilteredProgram()));

  return (
    <>
      <em>
        {getFilteredProgram().length} von {props.program.length} Runden
        gefunden.
      </em>
      <br />
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
              isEditable={props.isEditable}
              addReservation={props.addReservation}
              removeReservation={props.removeReservation}
            />
          </Dialog>
        )}
      </Show>
      <br />
      <ProgramOfDay
        day="SATURDAY"
        programOfDay={getGroupedAndSorted().SATURDAY}
        changePage={props.changePage}
      />
      <br />
      <br />
      <ProgramOfDay
        day="SUNDAY"
        programOfDay={getGroupedAndSorted().SUNDAY}
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
  const hasEntries = () => Object.values(props.programOfDay).flat().length > 0;
  const breaks = openingHours[props.day].breaks;
  const breakStarts = breaks.map((b) => b.from);
  const getType = (start: number) =>
    breakStarts.indexOf(start) === 0 ? "LUNCH" : "DINNER";

  return (
    <>
      <h3>{TXT.days[props.day]}</h3>
      <Show
        when={hasEntries()}
        fallback={
          <Box>
            Keine Spielrunden mit den ausgewählten Filtern am{" "}
            {TXT.days[props.day]} gefunden.
          </Box>
        }
      >
        <For each={Object.entries(props.programOfDay)}>
          {([hour, entries]) =>
            breakStarts.includes(Number(hour)) ? (
              <Break
                type={getType(Number(hour))}
                range={{ from: Number(hour), to: Number(hour) + 1 }}
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
      </Show>
    </>
  );
}

function Break(props: {
  type: "LUNCH" | "DINNER";
  range: { from: number; to: number };
}): JSX.Element {
  const title = props.type === "LUNCH" ? "Mittagessen" : "Nachtessen";
  /* const menu = "Pilzrisotto (vegi&nbsp;/&nbsp;vegan), Penne All'Arrabbiata und Penne Pesto (vegi&nbsp;/&nbsp;vegan).";*/
  return (
    <div style="margin-block-start: 2rem;">
      <Box>
        <small>
          {props.range.from} - {props.range.to} Uhr
        </small>
        <h4 style="margin-block-end: 0.5rem;">{title}</h4>
        <em>Das Menü wird zu einem späteren Zeitpunkt kommuniziert.</em>
        {
          // <p>
          //   Wir kochen: <span innerHTML={menu}></span>
          // </p>
        }
      </Box>
    </div>
  );
}

function Entry(props: {
  entry: ProgramEntryClient;
  changePage: ChangePageFn;
}): JSX.Element {
  const tagNames = gameTags
    .filter((g) => props.entry.tags.includes(g.name))
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
          (von {props.entry.playerCount.max})
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
            <span>Details & Teilnahme</span>
          </button>
        </li>
      </ul>
    </li>
  );
}
