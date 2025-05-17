import { For, Match, Show, Switch, type JSX } from "solid-js";
import type { Page } from "../load";
import { BoxLink } from "../components/BoxLink";
import { PageTemplate } from "./PageTemplate";
import { createStore, type Store } from "solid-js/store";
import { Input } from "@common/components/Input";
import { Textarea } from "@common/components/Textarea";
import { Button } from "@common/components/Button";
import { Checkbox } from "@common/components/Checkbox";
import { gameTags, type GameTag } from "@lst/components/anmeldung/data";
import type { DateTimeWindow, OpeningHours } from "../demo";
import { Icon } from "@common/components/Icon";
import type { PerDay, ProgramDay } from "../data";
import { Box } from "@common/components/Box";
import type { TimeRange } from "../types";

export function GamemasterPage(props: {
  changePage: (page: Page) => void;
}): JSX.Element {
  return (
    <PageTemplate title="Meine Spielrunden" changePage={props.changePage}>
      <BoxLink
        icon="grid-2-plus"
        type="success"
        onClick={() => props.changePage("GAMEMASTER_NEW")}
      >
        <h3>Neue Spielrunde erstellen</h3>
      </BoxLink>
    </PageTemplate>
  );
}

export type GameRoundEdit = {
  form: GameRoundEditForm;
  errors: GameRoundEditErrors;
};

export type GameRoundEditForm = {
  titel: string;
  system: string;
  descriptionShort: string;
  descriptionLong: string;
  slots: PerDay<TimeRange[]>;
  playerCountMin: number;
  playerCountMax: number;
  tags: GameTag[];
};

export type GameRoundEditErrors = {
  titleMissing: boolean;
  descriptionShortTooLong: boolean;
  descriptionLongTooLong: boolean;
  slotMissing: boolean;
  playerCountInvalid: boolean;
};

export function NewGamePage(props: {
  store: Store<GameRoundEdit>;
  openingHours: OpeningHours;
  changePage: (page: Page) => void;
}): JSX.Element {
  const [store, setStore] = createStore(props.store);

  function onSubmit(e: Event): void {
    e.preventDefault();
    console.log(store);
  }
  return (
    <PageTemplate
      title="Neue Spielrunde erfassen"
      changePage={props.changePage}
    >
      <form onSubmit={onSubmit} novalidate>
        <Input
          label="Titel"
          name="title"
          value={store.form.titel}
          onValueUpdate={(newValue) => setStore("form", "titel", newValue)}
        />
        <Input
          label="System (optional)"
          name="System"
          value={store.form.system}
          onValueUpdate={(newValue) => setStore("form", "system", newValue)}
        />
        <Textarea
          label="kurze Beschreibung"
          name="descriptionShort"
          value={store.form.descriptionShort}
          onValueUpdate={(newValue) =>
            setStore("form", "descriptionShort", newValue)
          }
          size="sm"
        />
        <Textarea
          label="lange Beschreibung (optional)"
          name="descriptionLong"
          value={store.form.descriptionLong}
          onValueUpdate={(newValue) =>
            setStore("form", "descriptionLong", newValue)
          }
        />
        <fieldset>
          <legend>Kategorien (optional)</legend>
          <div style="display: grid; gap: 0.5rem;">
            <For each={gameTags}>
              {(gameTag) => (
                <Checkbox
                  label={gameTag.label}
                  description={gameTag.description}
                  checked={store.form.tags.includes(gameTag.name)}
                  name={gameTag.name}
                  value={gameTag.name}
                  onValueUpdate={(checked) => {
                    if (checked) {
                      setStore(
                        "form",
                        "tags",
                        store.form.tags.concat([gameTag.name]),
                      );
                    } else {
                      setStore(
                        "form",
                        "tags",
                        store.form.tags.filter((t) => t !== gameTag.name),
                      );
                    }
                  }}
                />
              )}
            </For>
          </div>
        </fieldset>
        <fieldset>
          <legend>Zeitslots</legend>
          <TimeSlots
            slots={props.store.form.slots}
            openingHours={props.openingHours}
            addTimeSlot={(dateTime: DateTimeWindow) =>
              setStore(
                "form",
                "slots",
                dateTime.day,
                store.form.slots[dateTime.day].concat({
                  from: dateTime.from,
                  to: dateTime.to,
                }),
              )
            }
            removeTimeSlot={(dateTime: DateTimeWindow) =>
              setStore(
                "form",
                "slots",
                dateTime.day,
                store.form.slots[dateTime.day].filter(
                  (s) => s.from !== dateTime.from || s.to !== dateTime.to,
                ),
              )
            }
          />
        </fieldset>
        <div style="display: flex; flex-wrap: wrap; gap: 1rem;">
          <Button kind="gray" label="Spielrunde als Entwurf speichern" />
          <Button kind="danger" label="Abbrechen" />
          <Button type="submit" kind="success" label="Spielrunde erstellen" />
        </div>
      </form>
    </PageTemplate>
  );
}

// const MIN_SLOT_TIME_HOUR = 1;

type StartTimes = PerDay<number[]>;
function calculateStartTimes(_openingHours: OpeningHours): StartTimes {
  return {
    SATURDAY: [12, 22],
    SUNDAY: [11],
  };
}

type EndTimes = PerDay<Record<number, number[]>>;
function calculateEndTimes(_openingHours: OpeningHours): EndTimes {
  return {
    SATURDAY: {
      12: [13, 14],
      22: [44],
    },
    SUNDAY: {
      11: [23],
    },
  };
}

function TimeSlots(props: {
  slots: PerDay<TimeRange[]>;
  openingHours: OpeningHours;
  addTimeSlot: (dateTime: DateTimeWindow) => void;
  removeTimeSlot: (dateTime: DateTimeWindow) => void;
}): JSX.Element {
  const startTimes = calculateStartTimes(props.openingHours);
  const endTimes = calculateEndTimes(props.openingHours);

  return (
    <>
      <TimeSlotChooser
        startTimes={startTimes}
        endTimes={endTimes}
        chooseTimeSlot={props.addTimeSlot}
      />
      <Show when={props.slots["SATURDAY"].length > 0}>
        <h6>Samstag, 23. August 2025</h6>
        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
          <For each={props.slots["SATURDAY"]}>
            {(slot) => (
              <Button
                label={
                  <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center;">
                    <span>
                      von {slot.from} bis {slot.to} Uhr
                    </span>
                    <Icon icon="trash" />
                  </div>
                }
                kind="danger"
                onClick={() =>
                  props.removeTimeSlot({
                    day: "SATURDAY",
                    from: slot.from,
                    to: slot.to,
                  })
                }
              />
            )}
          </For>
        </div>
      </Show>
      <Show when={props.slots["SUNDAY"].length > 0}>
        <h6>Sonntag, 24. August 2025</h6>
        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
          <For each={props.slots["SUNDAY"]}>
            {(slot) => (
              <Button
                label={
                  <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center;">
                    <span>
                      von {slot.from} bis {slot.to} Uhr
                    </span>
                    <Icon icon="trash" />
                  </div>
                }
                kind="danger"
                onClick={() =>
                  props.removeTimeSlot({
                    day: "SUNDAY",
                    from: slot.from,
                    to: slot.to,
                  })
                }
              />
            )}
          </For>
        </div>
      </Show>
    </>
  );
}

type SlotState =
  | {
      kind: "INITIAL";
    }
  | {
      kind: "CHOOSE_DAY";
    }
  | {
      kind: "CHOOSE_START";
      day: ProgramDay;
    }
  | {
      kind: "CHOOSE_END";
      day: ProgramDay;
      start: number;
    };

function TimeSlotChooser(props: {
  startTimes: StartTimes;
  endTimes: EndTimes;
  chooseTimeSlot: (dateTime: DateTimeWindow) => void;
}): JSX.Element {
  const [store, setStore] = createStore<SlotState>({
    kind: "INITIAL",
  });

  return (
    <Switch>
      <Match when={store.kind === "INITIAL"}>
        <Button
          kind="success"
          label={
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center;">
              <Icon icon="circle-plus" /> <span>Neuen Slot erfassen</span>
            </div>
          }
          onClick={() => setStore({ kind: "CHOOSE_DAY" })}
        />
      </Match>
      <Match when={store.kind === "CHOOSE_DAY"}>
        <Box>
          <DayChooser
            changeDay={(day) => setStore({ kind: "CHOOSE_START", day })}
          />
        </Box>
      </Match>
      <Match when={store.kind === "CHOOSE_START"}>
        <Box>
          <div style="display: grid; gap: 0.5rem;">
            <DayChooser
              chosenDay={store.kind === "CHOOSE_START" ? store.day : undefined}
              changeDay={(day) => setStore({ kind: "CHOOSE_START", day })}
            />
            <StartChooser
              startTimes={
                store.kind === "CHOOSE_START" ? props.startTimes[store.day] : []
              }
              changeStart={(hour) =>
                setStore({ kind: "CHOOSE_END", start: hour })
              }
            />
          </div>
        </Box>
      </Match>
      <Match when={store.kind === "CHOOSE_END"}>
        <Box>
          <div style="display: grid; gap: 0.5rem;">
            <DayChooser
              chosenDay={store.kind === "CHOOSE_END" ? store.day : undefined}
              changeDay={(day) => setStore({ kind: "CHOOSE_START", day })}
            />
            <StartChooser
              chosenStart={
                store.kind === "CHOOSE_END" ? store.start : undefined
              }
              startTimes={
                store.kind === "CHOOSE_END" ? props.startTimes[store.day] : []
              }
              changeStart={(hour) =>
                setStore({ kind: "CHOOSE_END", start: hour })
              }
            />
            <EndChooser
              endTimes={
                store.kind === "CHOOSE_END"
                  ? (props.endTimes[store.day][store.start] ?? [])
                  : []
              }
              changeEnd={(hour) => {
                if (store.kind === "CHOOSE_END") {
                  props.chooseTimeSlot({
                    day: store.day,
                    from: store.start,
                    to: hour,
                  });
                  setStore({ kind: "INITIAL" });
                }
              }}
            />
          </div>
        </Box>
      </Match>
    </Switch>
  );
}

function DayChooser(props: {
  chosenDay?: ProgramDay | undefined;
  changeDay: (day: ProgramDay) => void;
}): JSX.Element {
  return (
    <>
      <em>Wähle eine Tag:</em>
      <div style="display: flex; flex-wrap: warp; gap: .5rem;">
        <Button
          kind={props.chosenDay === "SATURDAY" ? "success" : "gray"}
          label="Samstag"
          onClick={() => props.changeDay("SATURDAY")}
        />
        <Button
          kind={props.chosenDay === "SUNDAY" ? "success" : "gray"}
          label="Sonntag"
          onClick={() => props.changeDay("SUNDAY")}
        />
      </div>
    </>
  );
}

function StartChooser(props: {
  startTimes: number[];
  chosenStart?: number | undefined;
  changeStart: (hour: number) => void;
}): JSX.Element {
  return (
    <>
      <em>Wähle eine Startzeit:</em>
      <div style="display: flex; flex-wrap: warp; gap: .5rem;">
        <For each={props.startTimes}>
          {(time) => (
            <Button
              kind={props.chosenStart === time ? "success" : "gray"}
              label={`${time} Uhr`}
              onClick={() => props.changeStart(time)}
            />
          )}
        </For>
      </div>
    </>
  );
}

function EndChooser(props: {
  endTimes: number[];
  changeEnd: (hour: number) => void;
}): JSX.Element {
  return (
    <>
      <em>Wähle eine Endzeit:</em>
      <div style="display: flex; flex-wrap: warp; gap: .5rem;">
        <For each={props.endTimes}>
          {(time) => (
            <Button
              kind="gray"
              label={`${time} Uhr`}
              onClick={() => props.changeEnd(time)}
            />
          )}
        </For>
      </div>
    </>
  );
}
