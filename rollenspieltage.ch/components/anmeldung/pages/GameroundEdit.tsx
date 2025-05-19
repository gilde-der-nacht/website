import { For, Match, Show, Switch, type JSX } from "solid-js";
import type { Page } from "../load";
import { PageTemplate } from "./PageTemplate";
import { createStore, type Store } from "solid-js/store";
import { Input, InputInteger } from "@common/components/Input";
import { Textarea } from "@common/components/Textarea";
import { Button } from "@common/components/Button";
import { Checkbox } from "@common/components/Checkbox";
import { gameTags, type GameTag } from "@lst/components/anmeldung/data";
import { Icon } from "@common/components/Icon";
import { Box } from "@common/components/Box";
import {
  getHours,
  type DateTimeWindow,
  type PerDay,
  type ProgramDay,
  type TimeRange,
} from "../utils/time";
import type { OpeningHours } from "../data";
import {
  collectPairsToObject,
  getNumberedKeys,
} from "@common/components/utils";
import { TXT } from "../text";

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
  descriptionShortMissing: boolean;
  descriptionShortTooLong: boolean;
  descriptionLongTooLong: boolean;
  slotMissing: boolean;
};

const DESCR_SHORT_MAX_CHAR = 200;
const DESCR_LONG_MAX_CHAR = 500;

export function NewGamePage(props: {
  store: Store<GameRoundEdit>;
  openingHours: OpeningHours;
  changePage: (page: Page) => void;
}): JSX.Element {
  const [store, setStore] = createStore(props.store);

  function onSubmit(e: Event): void {
    e.preventDefault();

    const [min, max] = [store.form.playerCountMin, store.form.playerCountMax]
      .map((n) => Math.max(1, n))
      .toSorted((a, b) => a - b);
    setStore("form", "playerCountMin", min ?? 1);
    setStore("form", "playerCountMax", max ?? 1);

    const titleIsMissing = store.form.titel.trim().length === 0;
    setStore("errors", "titleMissing", titleIsMissing);

    const descriptionShortIsMissing =
      store.form.descriptionShort.trim().length === 0;
    setStore("errors", "descriptionShortMissing", descriptionShortIsMissing);

    const descriptionShortTooLong =
      store.form.descriptionShort.length > DESCR_SHORT_MAX_CHAR;
    setStore("errors", "descriptionShortTooLong", descriptionShortTooLong);

    const descriptionLongTooLong =
      store.form.descriptionLong.length > DESCR_LONG_MAX_CHAR;
    setStore("errors", "descriptionLongTooLong", descriptionLongTooLong);

    const slotMissing =
      store.form.slots["SATURDAY"].concat(store.form.slots["SUNDAY"]).length ===
      0;
    setStore("errors", "slotMissing", slotMissing);

    if (
      store.errors.titleMissing ||
      store.errors.descriptionShortMissing ||
      store.errors.descriptionShortTooLong ||
      store.errors.descriptionLongTooLong ||
      store.errors.slotMissing
    ) {
      return;
    }
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
          onValueUpdate={(newValue) => {
            setStore("form", "titel", newValue);
            setStore("errors", "titleMissing", false);
          }}
        />
        <Show when={store.errors.titleMissing}>
          <Box type="danger">Dies ist ein Pflichtfeld.</Box>
        </Show>
        <Input
          label="System (optional)"
          name="System"
          value={store.form.system}
          onValueUpdate={(newValue) => setStore("form", "system", newValue)}
        />
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">
          <InputInteger
            label="Anzahl Mitspielende (Minimum)"
            name="playerCountMin"
            value={store.form.playerCountMin}
            onValueUpdate={(newValue) =>
              setStore("form", "playerCountMin", newValue)
            }
            min={1}
            max={store.form.playerCountMax}
          />
          <InputInteger
            label="Anzahl Mitspielende (Maximum)"
            name="playerCountMax"
            value={store.form.playerCountMax}
            onValueUpdate={(newValue) =>
              setStore("form", "playerCountMax", newValue)
            }
            min={store.form.playerCountMin}
          />
        </div>
        <Textarea
          label="kurze Beschreibung"
          name="descriptionShort"
          value={store.form.descriptionShort}
          onValueUpdate={(newValue) => {
            setStore("form", "descriptionShort", newValue);
            setStore("errors", "descriptionShortMissing", false);
            setStore(
              "errors",
              "descriptionShortTooLong",
              newValue.length > DESCR_SHORT_MAX_CHAR,
            );
          }}
          size="sm"
        />
        <Show when={store.errors.descriptionShortMissing}>
          <Box type="danger">Dies ist ein Pflichtfeld.</Box>
        </Show>
        <Show when={store.errors.descriptionShortTooLong}>
          <Box type="danger">
            Dieses Feld ist auf {DESCR_SHORT_MAX_CHAR} Zeichen limitiert.
          </Box>
        </Show>
        <Textarea
          label="lange Beschreibung (optional)"
          name="descriptionLong"
          value={store.form.descriptionLong}
          onValueUpdate={(newValue) => {
            setStore("form", "descriptionLong", newValue);
            setStore(
              "errors",
              "descriptionLongTooLong",
              newValue.length > DESCR_LONG_MAX_CHAR,
            );
          }}
        />
        <Show when={store.errors.descriptionLongTooLong}>
          <Box type="danger">
            Dieses Feld ist auf {DESCR_LONG_MAX_CHAR} Zeichen limitiert.
          </Box>
        </Show>
        <fieldset>
          <legend>Zeitslots</legend>
          <TimeSlots
            slots={props.store.form.slots}
            openingHours={props.openingHours}
            addTimeSlot={(dateTime: DateTimeWindow) => {
              setStore(
                "form",
                "slots",
                dateTime.day,
                store.form.slots[dateTime.day].concat({
                  from: dateTime.from,
                  to: dateTime.to,
                }),
              );
              setStore("errors", "slotMissing", false);
            }}
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
          <Show when={store.errors.slotMissing}>
            <br />
            <br />
            <Box type="danger">Wähle mindestens einen Zeitslot aus.</Box>
          </Show>
        </fieldset>
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
        <Show
          when={
            store.errors.titleMissing ||
            store.errors.descriptionShortMissing ||
            store.errors.descriptionShortTooLong ||
            store.errors.descriptionLongTooLong ||
            store.errors.slotMissing
          }
        >
          <Box type="danger">
            <h4>Spielrunde inkomplett</h4>
            Du hast noch einen oder mehre Fehler/fehlende Informationen in
            dieser Spielrunde (siehe oben). Du kannst die Spielrunde als Entwurf
            speichern und später vervollständigen. Die Spielrunde wird erst
            veröffentlicht, wenn alle Informationen komplett sind.
            <div style="margin-top: 1rem; display: flex; justify-content: flex-end;">
              <Button kind="gray" label="Spielrunde als Entwurf speichern" />
            </div>
          </Box>
        </Show>
        <div style="display: flex; flex-wrap: wrap; gap: 1rem; justify-content: space-between;">
          <Button kind="danger" label="Abbrechen" />
          <Button type="submit" kind="success" label="Spielrunde erstellen" />
        </div>
      </form>
    </PageTemplate>
  );
}

const MIN_SLOT_TIME_HOUR = 1;
type DaySections = PerDay<{ [s: number]: number[] }>;
function calculateDaySections(openingHours: OpeningHours): DaySections {
  function calculatePerDay(
    oh: OpeningHours[ProgramDay],
  ): Record<number, number[]> {
    const openHours = getHours(oh.open, true);
    const splitByBreaks = oh.breaks
      .map((br) => getHours(br, true))
      .reduce(
        (acc, curr) => {
          const breakStart = curr.at(0);
          const breakEnd = curr.at(-1);
          if (breakStart === undefined || breakEnd === undefined) {
            return acc;
          }

          const newAcc: number[][] = [];
          acc.forEach((range) => {
            const before: number[] = [];
            const after: number[] = [];
            range.forEach((hour) => {
              if (hour <= breakStart) {
                before.push(hour);
              }
              if (breakEnd <= hour) {
                after.push(hour);
              }
            });
            if (before.length > 0) {
              newAcc.push(before);
            }
            if (after.length > 0) {
              newAcc.push(after);
            }
          });

          return newAcc;
        },
        [openHours],
      );

    return splitByBreaks
      .map((section) => {
        const startTimes = section.slice(0, MIN_SLOT_TIME_HOUR * -1);
        return collectPairsToObject(
          startTimes.map((startHour) => {
            const endHours = section.filter(
              (endHour) => endHour >= startHour + MIN_SLOT_TIME_HOUR,
            );
            return [startHour, endHours];
          }),
        );
      })
      .reduce((acc, cur) => ({ ...acc, ...cur }), {});
  }

  return {
    SATURDAY: calculatePerDay(openingHours["SATURDAY"]),
    SUNDAY: calculatePerDay(openingHours["SUNDAY"]),
  };
}

function TimeSlots(props: {
  slots: PerDay<TimeRange[]>;
  openingHours: OpeningHours;
  addTimeSlot: (dateTime: DateTimeWindow) => void;
  removeTimeSlot: (dateTime: DateTimeWindow) => void;
}): JSX.Element {
  const daySections = calculateDaySections(props.openingHours);

  return (
    <>
      <TimeSlotChooser
        daySections={daySections}
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
    }
  | {
      kind: "WAIT_FOR_CONFIRMATION";
      day: ProgramDay;
      start: number;
      end: number;
    };

function TimeSlotChooser(props: {
  daySections: DaySections;
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
                store.kind === "CHOOSE_START"
                  ? getNumberedKeys(props.daySections[store.day])
                  : []
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
                store.kind === "CHOOSE_END"
                  ? getNumberedKeys(props.daySections[store.day])
                  : []
              }
              changeStart={(hour) =>
                setStore({ kind: "CHOOSE_END", start: hour })
              }
            />
            <EndChooser
              endTimes={
                store.kind === "CHOOSE_END"
                  ? (props.daySections[store.day][store.start] ?? [])
                  : []
              }
              changeEnd={(hour) => {
                if (store.kind === "CHOOSE_END") {
                  setStore({
                    kind: "WAIT_FOR_CONFIRMATION",
                    day: store.day,
                    start: store.start,
                    end: hour,
                  });
                }
              }}
            />
          </div>
        </Box>
      </Match>
      <Match when={store.kind === "WAIT_FOR_CONFIRMATION"}>
        <Box>
          <div style="display: grid; gap: 0.5rem;">
            <DayChooser
              chosenDay={
                store.kind === "WAIT_FOR_CONFIRMATION" ? store.day : undefined
              }
              changeDay={(day) => setStore({ kind: "CHOOSE_START", day })}
            />
            <StartChooser
              chosenStart={
                store.kind === "WAIT_FOR_CONFIRMATION" ? store.start : undefined
              }
              startTimes={
                store.kind === "WAIT_FOR_CONFIRMATION"
                  ? getNumberedKeys(props.daySections[store.day])
                  : []
              }
              changeStart={(hour) =>
                setStore({ kind: "CHOOSE_END", start: hour })
              }
            />
            <EndChooser
              chosenEnd={
                store.kind === "WAIT_FOR_CONFIRMATION" ? store.end : undefined
              }
              endTimes={
                store.kind === "WAIT_FOR_CONFIRMATION"
                  ? (props.daySections[store.day][store.start] ?? [])
                  : []
              }
              changeEnd={(hour) => {
                if (store.kind === "WAIT_FOR_CONFIRMATION") {
                  setStore({
                    kind: "WAIT_FOR_CONFIRMATION",
                    day: store.day,
                    start: store.start,
                    end: hour,
                  });
                }
              }}
            />
            <div style="margin-block-start: 1rem;">
              <Button
                label={`Slot "${store.kind === "WAIT_FOR_CONFIRMATION" ? `${TXT.days[store.day]}, von ${store.start} bis ${store.end} Uhr` : ""}" erstellen`}
                kind="success"
                onClick={() => {
                  if (store.kind === "WAIT_FOR_CONFIRMATION") {
                    props.chooseTimeSlot({
                      day: store.day,
                      from: store.start,
                      to: store.end,
                    });
                    setStore({ kind: "INITIAL" });
                  }
                }}
              />
            </div>
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
      <div style="display: flex; flex-wrap: wrap; gap: .5rem;">
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
      <div style="display: flex; flex-wrap: wrap; gap: .5rem;">
        <For each={props.startTimes}>
          {(time) => (
            <Button
              kind={props.chosenStart === time ? "success" : "gray"}
              label={<span style="white-space: nowrap;">{time} Uhr</span>}
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
  chosenEnd?: number | undefined;
  changeEnd: (hour: number) => void;
}): JSX.Element {
  return (
    <>
      <em>Wähle eine Endzeit:</em>
      <div style="display: flex; flex-wrap: wrap; gap: .5rem;">
        <For each={props.endTimes}>
          {(time) => (
            <Button
              kind={props.chosenEnd === time ? "success" : "gray"}
              label={<span style="white-space: nowrap;">{time} Uhr</span>}
              onClick={() => props.changeEnd(time)}
            />
          )}
        </For>
      </div>
    </>
  );
}
