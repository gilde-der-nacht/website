import {
  batch,
  createMemo,
  For,
  Match,
  Show,
  Switch,
  type JSX,
} from "solid-js";
import { PageTemplate } from "@rst/components/anmeldung/pages/PageTemplate";
import { createStore, type Store } from "solid-js/store";
import { Input, InputInteger } from "@common/components/Input";
import { Textarea } from "@common/components/Textarea";
import { Button } from "@common/components/Button";
import { Checkbox } from "@common/components/Checkbox";
import { Icon } from "@common/components/Icon";
import { Box } from "@common/components/Box";
import {
  getHours,
  type DateTimeWindow,
  type PerDay,
  type ProgramDay,
} from "@rst/components/anmeldung/utils/time";
import {
  collectPairsToObject,
  getNumberedKeys,
} from "@common/components/utils";
import type { ChangePageFn } from "@rst/components/anmeldung/Router";
import { gameTags } from "@rst/components/anmeldung/constant/tags";
import {
  openingHours,
  type OpeningHours,
} from "@rst/components/anmeldung/constant/hours";
import { TXT } from "@rst/components/anmeldung/constant/texts";
import type { GameroundNewEditClient } from "@rst/components/anmeldung/api/gameround-edit";
import {
  DESCR_LONG_MAX_CHAR,
  DESCR_SHORT_MAX_CHAR,
  validateNewGameround,
} from "@rst/components/anmeldung/forms/validation";

export function NewGamePage(props: {
  store: Store<GameroundNewEditClient>;
  changePage: ChangePageFn;
  createNewGame: () => void;
}): JSX.Element {
  const [store, setStore] = createStore(props.store);
  const errors = createMemo(() => validateNewGameround(store));

  function onSubmit(e: Event): void {
    e.preventDefault();

    const [min, max] = [
      store.playerCount.min.value,
      store.playerCount.max.value,
    ]
      .map((n) => Math.max(1, n))
      .toSorted((a, b) => a - b);

    batch(() => {
      setStore("playerCount", "min", "value", min ?? 1);
      setStore("playerCount", "max", "value", max ?? 1);
    });

    if (errors().hasErrors) {
      return;
    }

    props.createNewGame();
    props.changePage({ kind: "GAMEMASTER" });
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
          value={store.title.value}
          onValueUpdate={(newValue) => setStore("title", "value", newValue)}
          onBlur={() => setStore("title", "isDirty", true)}
        />
        <Show when={errors().titleMissing && store.title.isDirty}>
          <Box type="danger">{TXT.mandatoryField}</Box>
        </Show>
        <Input
          label="System (optional)"
          name="System"
          value={store.system.value}
          onValueUpdate={(newValue) => setStore("system", "value", newValue)}
          onBlur={() => setStore("system", "isDirty", true)}
        />
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">
          <InputInteger
            label="Anzahl Mitspielende (Minimum)"
            name="playerCountMin"
            value={store.playerCount.min.value}
            onValueUpdate={(newValue) =>
              setStore("playerCount", "min", "value", newValue)
            }
            onBlur={() => setStore("playerCount", "min", "isDirty", true)}
            min={1}
            max={store.playerCount.max.value}
          />
          <InputInteger
            label="Anzahl Mitspielende (Maximum)"
            name="playerCountMax"
            value={store.playerCount.max.value}
            onValueUpdate={(newValue) =>
              setStore("playerCount", "max", "value", newValue)
            }
            onBlur={() => setStore("playerCount", "max", "isDirty", true)}
            min={store.playerCount.min.value}
          />
        </div>
        <Textarea
          label="kurze Beschreibung"
          name="descriptionShort"
          value={store.description.short.value}
          onValueUpdate={(newValue) =>
            setStore("description", "short", "value", newValue)
          }
          onBlur={() => setStore("description", "short", "isDirty", true)}
          size="sm"
        />
        <Show
          when={
            errors().descriptionShortMissing && store.description.short.isDirty
          }
        >
          <Box type="danger">{TXT.mandatoryField}</Box>
        </Show>
        <Show
          when={
            errors().descriptionShortTooLong && store.description.short.isDirty
          }
        >
          <Box type="danger">
            {TXT.charLimitBy.replace("{}", String(DESCR_SHORT_MAX_CHAR))}
          </Box>
        </Show>
        <Textarea
          label="lange Beschreibung (optional)"
          name="descriptionLong"
          value={store.description.long.value}
          onValueUpdate={(newValue) =>
            setStore("description", "long", "value", newValue)
          }
          onBlur={() => setStore("description", "long", "isDirty", true)}
        />
        <Show
          when={
            errors().descriptionLongTooLong && store.description.long.isDirty
          }
        >
          <Box type="danger">
            {TXT.charLimitBy.replace("{}", String(DESCR_LONG_MAX_CHAR))}
          </Box>
        </Show>
        <fieldset>
          <legend>Zeitslots</legend>
          <TimeSlots
            slots={props.store.slots}
            addTimeSlot={(newSlot: DateTimeWindow) =>
              setStore("slots", store.slots.concat(newSlot))
            }
            removeTimeSlot={(slot: DateTimeWindow) =>
              setStore(
                "slots",
                store.slots.filter(
                  (s) =>
                    s.from !== slot.from ||
                    s.to !== slot.to ||
                    s.day !== slot.day,
                ),
              )
            }
          />
          <Show when={errors().slotMissing}>
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
                  checked={store.tagNames.includes(gameTag.name)}
                  name={gameTag.name}
                  value={gameTag.name}
                  onValueUpdate={(checked) => {
                    if (checked) {
                      setStore(
                        "tagNames",
                        store.tagNames.concat([gameTag.name]),
                      );
                    } else {
                      setStore(
                        "tagNames",
                        store.tagNames.filter((t) => t !== gameTag.name),
                      );
                    }
                  }}
                />
              )}
            </For>
          </div>
        </fieldset>
        <Show when={errors().hasErrors}>
          <Box type="danger">
            <h4>Spielrunde inkomplett</h4>
            Du hast noch einen oder mehre Fehler/fehlende Informationen in
            dieser Spielrunde (siehe oben). Du kannst die Spielrunde als Entwurf
            speichern und später vervollständigen. Die Spielrunde wird erst
            veröffentlicht, wenn alle Informationen komplett sind.
            <div style="margin-top: 1rem; display: flex; justify-content: flex-end;">
              <Button
                kind="success"
                label="Spielrunde als Entwurf speichern"
                onClick={() => {
                  props.createNewGame();
                  props.changePage({ kind: "GAMEMASTER" });
                }}
              />
            </div>
          </Box>
        </Show>
        <div style="display: flex; flex-wrap: wrap; gap: 1rem; justify-content: space-between;">
          <Button
            kind="danger"
            label="Abbrechen"
            onClick={() => props.changePage({ kind: "GAMEMASTER" })}
          />
          <Button
            type="submit"
            kind={errors().hasErrors ? "gray" : "success"}
            disabled={errors().hasErrors}
            label="Spielrunde erstellen"
          />
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

function groupByDay(slots: DateTimeWindow[]): PerDay<DateTimeWindow[]> {
  const { SATURDAY, SUNDAY } = Object.groupBy(slots, (slot) => slot.day);
  return { SATURDAY: SATURDAY ?? [], SUNDAY: SUNDAY ?? [] };
}

function TimeSlots(props: {
  slots: DateTimeWindow[];
  addTimeSlot: (dateTime: DateTimeWindow) => void;
  removeTimeSlot: (dateTime: DateTimeWindow) => void;
}): JSX.Element {
  const daySections = calculateDaySections(openingHours);
  const { SATURDAY, SUNDAY } = groupByDay(props.slots);

  return (
    <>
      <TimeSlotChooser
        daySections={daySections}
        chooseTimeSlot={props.addTimeSlot}
      />
      <Show when={SATURDAY.length > 0}>
        <h6>Samstag, 23. August 2025</h6>
        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
          <For each={SATURDAY}>
            {(slot) => (
              <Button
                label={
                  <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center;">
                    <span>
                      von {slot.from} bis {slot.to} Uhr
                    </span>
                    <Icon icon="trash" style="color: var(--clr-danger-11);" />
                  </div>
                }
                kind="gray"
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
      <Show when={SUNDAY.length > 0}>
        <h6>Sonntag, 24. August 2025</h6>
        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
          <For each={SUNDAY}>
            {(slot) => (
              <Button
                label={
                  <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center;">
                    <span>
                      von {slot.from} bis {slot.to} Uhr
                    </span>
                    <Icon icon="trash" style="color: var(--clr-danger-11);" />
                  </div>
                }
                kind="gray"
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
        <Box onClose={() => setStore({ kind: "INITIAL" })}>
          <div style="display: grid; gap: 0.5rem;">
            <DayChooser
              changeDay={(day) => setStore({ kind: "CHOOSE_START", day })}
            />
          </div>
        </Box>
      </Match>
      <Match when={store.kind === "CHOOSE_START"}>
        <Box onClose={() => setStore({ kind: "INITIAL" })}>
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
        <Box onClose={() => setStore({ kind: "INITIAL" })}>
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
        <Box onClose={() => setStore({ kind: "INITIAL" })}>
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
