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
import {
  WeekendTimetable,
  type ProgramEntryTimetableView,
} from "@rst/components/anmeldung/components/Timetable";
import {
  toRange,
  type PerDay,
  type ProgramDay,
} from "@rst/components/anmeldung/utils/time";
import {
  helpTimes,
  helpTypes,
  type HelpEntryView,
  type HelpTimes,
} from "@rst/components/anmeldung/constant/helping";
import { Chip } from "@common/components/Chip";
import { ButtonWithIcon, IconOnlyButton } from "@common/components/Button";
import { Icon } from "@common/components/Icon";
import { Dialog, initDialogStore } from "@common/components/Dialog";
import { createStore, type Store } from "solid-js/store";
import type { ChangePageFn } from "@rst/components/anmeldung/Router";
import { TXT } from "@rst/components/anmeldung/constant/texts";
import { Box, SimpleBox } from "@common/components/Box";
import { InputButton } from "@rst/components/anmeldung/components/GameDialog";
import type {
  HelpReservationClient,
  HelpReservationCreateClient,
  SaveClient,
} from "@rst/components/anmeldung/api/save";
import type { Result } from "@rst/components/anmeldung/api/utils";

export function HelpingPage(props: {
  store: Store<SaveClient>;
  help: Resource<Result<string[]>>;
  uuid: string | null;
  isEditable: boolean;
  changePage: ChangePageFn;
}): JSX.Element {
  const [store, setStore] = createStore(props.store);

  return (
    <>
      <p>
        Beim Kiosk und der Essensausgabe können wir immer ein paar helfende
        Hände gebrauchen. Wenn du bereit bist zu helfen, klicke in der
        jeweiligen Stunde auf das Handsymbol <Icon icon="hand-heart" />.
      </p>
      <br />
      <Suspense fallback={<Box>{TXT.loading.program}</Box>}>
        <Show
          when={props.help()}
          fallback={<Box type="danger">{TXT.error.help}</Box>}
        >
          {(help) => (
            <Show
              when={help().kind === "SUCCESS"}
              fallback={
                <Box type="danger">
                  <p>Plan konnte nicht geladen werden.</p>
                </Box>
              }
            >
              <HelpingContent
                uuid={props.uuid}
                helpReservations={store.helping}
                externalHelpReservations={(help() as { data: string[] }).data}
                isEditable={props.isEditable}
                changePage={props.changePage}
                addReservation={(reservation) =>
                  setStore("helping", store.helping.length, {
                    ...reservation,
                    uuid: crypto.randomUUID(),
                  })
                }
                removeReservation={(reservationUuid) => {
                  setStore(
                    "helping",
                    store.helping.filter((r) => r.uuid !== reservationUuid),
                  );
                }}
              />
            </Show>
          )}
        </Show>
      </Suspense>
    </>
  );
}

function HelpingContent(props: {
  uuid: string | null;
  helpReservations: HelpReservationClient[];
  externalHelpReservations: string[];
  isEditable: boolean;
  addReservation: (reservation: HelpReservationCreateClient) => void;
  removeReservation: (reservationUuid: string) => void;
  changePage: ChangePageFn;
}): JSX.Element {
  const [dialogStore, setDialogStore] = createStore(
    initDialogStore(props.uuid !== null),
  );

  createEffect(() => {
    setDialogStore("open", props.uuid !== null);
  });

  const selectedEntry = (): HelpEntryView | undefined => {
    const allEntries = helpTimesToHelpEntryView(
      "SATURDAY",
      helpTimes.SATURDAY,
    ).concat(helpTimesToHelpEntryView("SUNDAY", helpTimes.SUNDAY));
    return allEntries.find((entry) => entry.entry.uuid === props.uuid);
  };

  const alreadyReservedUuids = (): string[] => {
    const already: string[] = [];
    props.helpReservations.forEach((r) => {
      already.push(r.helpEntryUuid);
    });
    props.externalHelpReservations.forEach((r) => {
      already.push(r);
    });

    return already;
  };

  const entries = () =>
    ({
      SATURDAY: aggregateEntries({
        constants: helpTimes.SATURDAY,
        alreadyReservedUuids: alreadyReservedUuids(),
        myReservations: props.helpReservations,
        changePage: props.changePage,
      }),
      SUNDAY: aggregateEntries({
        constants: helpTimes.SUNDAY,
        alreadyReservedUuids: alreadyReservedUuids(),
        myReservations: props.helpReservations,
        changePage: props.changePage,
      }),
    }) satisfies PerDay<ProgramEntryTimetableView[]>;

  return (
    <>
      <Show when={selectedEntry()}>
        {(entry) => (
          <Dialog
            store={dialogStore}
            title={helpTypes[entry().entry.kind].title}
            onClose={() => {
              return props.changePage(
                { kind: "HELPING" },
                { disableScroll: true },
              );
            }}
            size="large"
          >
            <HelpDialog
              entry={entry()}
              helpReservations={props.helpReservations}
              externalHelpReservations={props.externalHelpReservations}
              isEditable={props.isEditable}
              addReservation={props.addReservation}
              removeReservation={props.removeReservation}
            />
          </Dialog>
        )}
      </Show>
      <WeekendTimetable programEntries={entries()} conflictsAllowed={true} />
    </>
  );
}

function aggregateEntries(props: {
  constants: HelpTimes;
  alreadyReservedUuids: string[];
  myReservations: HelpReservationClient[];
  changePage: ChangePageFn;
}): ProgramEntryTimetableView[] {
  const entries: ProgramEntryTimetableView[] = [];
  const frequencies = uuidFrequencies(props.alreadyReservedUuids);

  Object.entries(props.constants).forEach(([hour, slots]) => {
    slots.forEach((slot) => {
      const range = {
        from: Number(hour),
        to: Number(hour) + 1,
      };

      const emptySeats = () => slot.count - (frequencies[slot.uuid] ?? 0);
      const helpingMyself = () =>
        props.myReservations.filter((r) => r.helpEntryUuid === slot.uuid)
          .length > 0;

      const classes = () => {
        const cls = ["box-simple", "timeview-entry"];
        if (helpingMyself()) {
          cls.push("success");
        }
        return cls.join(" ");
      };

      if (emptySeats() === 0) {
        entries.push({
          range,
          component: () => (
            <div class={classes()}>
              <Chip
                title="Helfer:innen gesucht"
                inverted={helpingMyself()}
                size="small"
              >
                HL
              </Chip>
              <Show when={helpingMyself()}>
                <IconOnlyButton
                  icon="hand-heart"
                  kind="ghost"
                  onClick={() =>
                    props.changePage(
                      { kind: "HELPING-SLOT", uuid: slot.uuid },
                      { disableScroll: true },
                    )
                  }
                  title="Helfen"
                />
              </Show>
              <h5>{helpTypes[slot.kind].title}</h5>
              <p class="duration">
                <em>alle Helfer:innen gefunden</em>
              </p>
            </div>
          ),
        });
      } else {
        entries.push({
          range,
          component: () => (
            <div class={classes()}>
              <Chip
                title="Helfer:innen gesucht"
                inverted={helpingMyself()}
                size="small"
              >
                HL
              </Chip>
              <IconOnlyButton
                icon="hand-heart"
                kind="ghost"
                onClick={() =>
                  props.changePage(
                    { kind: "HELPING-SLOT", uuid: slot.uuid },
                    { disableScroll: true },
                  )
                }
                title="Helfen"
              />
              <h5>{helpTypes[slot.kind].title}</h5>
              <p class="duration">
                {emptySeats()}{" "}
                {emptySeats() === 1 ? "Helfer:in" : "Helfer:innen"} gesucht
              </p>
            </div>
          ),
        });
      }
    });
  });
  return entries;
}

function helpTimesToHelpEntryView(
  day: ProgramDay,
  perDay: HelpTimes,
): HelpEntryView[] {
  const views: HelpEntryView[] = [];

  Object.entries(perDay).forEach(([hourStr, entries]) => {
    const hour = Number(hourStr);
    entries.forEach((entry) => {
      views.push({
        dateTime: {
          day,
          from: hour,
          to: hour + 1,
        },
        entry,
      });
    });
  });

  return views;
}

function HelpDialog(props: {
  entry: HelpEntryView;
  helpReservations: HelpReservationClient[];
  externalHelpReservations: string[];
  isEditable: boolean;
  addReservation: (reservation: HelpReservationCreateClient) => void;
  removeReservation: (reservationUuid: string) => void;
}): JSX.Element {
  const { dateTime, entry } = props.entry;
  const helpType = helpTypes[entry.kind];

  const helpReservations = () =>
    props.helpReservations.filter((r) => r.helpEntryUuid === entry.uuid);

  const externalReserved = props.externalHelpReservations.filter(
    (r) => r === entry.uuid,
  ).length;

  const range = () =>
    toRange(entry.count).map((i) => {
      const myReservation = helpReservations()[i];
      if (myReservation !== undefined) {
        return myReservation;
      }
      if (entry.count - externalReserved <= i) {
        return { kind: "RESERVED_OTHER" } as const;
      }
      return { kind: "FREE" } as const;
    });

  const hasReservedForThemselves = (): boolean => {
    return helpReservations().find((r) => r.kind === "SELF") !== undefined;
  };

  return (
    <div class="game-dialog">
      <ul role="list" style="display: grid; gap: 0.5rem;">
        <li>
          <strong style="color: var(--clr-accent-1);">Tag, Zeit:</strong> <br />
          {TXT.days[dateTime.day]}, {dateTime.from} - {dateTime.to} Uhr
        </li>
        <li>
          <strong style="color: var(--clr-accent-1);">Beschreibung:</strong>{" "}
          <br />
          {helpType.description}
        </li>
      </ul>
      <div class="reservations">
        <h5 style="margin-block-start: 0">Plätze reservieren</h5>
        <div class="reservation-table">
          <For each={range()}>
            {(seat, i) => (
              <>
                <div class="count">{i() + 1}</div>
                <Switch>
                  <Match when={seat.kind === "RESERVED_OTHER"}>
                    <Box>Bereits reserviert</Box>
                  </Match>
                  <Match when={!props.isEditable}>
                    <Box>Freier Platz</Box>
                  </Match>
                  <Match when={seat.kind === "SELF"}>
                    <SimpleBox type="success">
                      <div class="reservation-table-entry">
                        <p>Reserviert für mich </p>
                        <IconOnlyButton
                          icon="trash"
                          onClick={() =>
                            props.removeReservation(
                              seat.kind === "SELF"
                                ? seat.uuid
                                : "should not happen",
                            )
                          }
                        />
                      </div>
                    </SimpleBox>
                  </Match>
                  <Match when={seat.kind === "FRIEND"}>
                    <SimpleBox type="success">
                      <div class="reservation-table-entry">
                        <p>
                          Reserviert für "
                          {seat.kind === "FRIEND"
                            ? seat.name
                            : "[Fehler beim Laden]"}
                          "
                        </p>
                        <IconOnlyButton
                          icon="trash"
                          onClick={() =>
                            props.removeReservation(
                              seat.kind === "FRIEND"
                                ? seat.uuid
                                : "should not happen",
                            )
                          }
                        />
                      </div>
                    </SimpleBox>
                  </Match>
                  <Match when={seat.kind === "FREE"}>
                    <Show
                      when={hasReservedForThemselves()}
                      fallback={
                        <div style="display:grid; gap: 1rem; grid-template-columns: max-content 1fr;">
                          <ButtonWithIcon
                            icon="person-to-portal"
                            label="Mich anmelden"
                            kind="success"
                            onClick={() =>
                              props.addReservation({
                                kind: "SELF",
                                helpEntryUuid: entry.uuid,
                              })
                            }
                          />
                          <InputButton
                            addFriend={(name) =>
                              props.addReservation({
                                kind: "FRIEND",
                                helpEntryUuid: entry.uuid,
                                name,
                              })
                            }
                          />
                        </div>
                      }
                    >
                      <InputButton
                        addFriend={(name) =>
                          props.addReservation({
                            kind: "FRIEND",
                            helpEntryUuid: entry.uuid,
                            name,
                          })
                        }
                      />
                    </Show>
                  </Match>
                </Switch>
              </>
            )}
          </For>
        </div>
      </div>
    </div>
  );
}

function uuidFrequencies(uuids: string[]): Record<string, number> {
  const grouped = Object.groupBy(uuids, (id) => id);
  const frequencies: Record<string, number> = {};
  for (const uuid of uuids) {
    frequencies[uuid] = grouped[uuid]?.length ?? 0;
  }
  return frequencies;
}
