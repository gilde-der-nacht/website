import { batch } from "solid-js";
import type { ChangePageFn } from "@rst/components/anmeldung/Router";
import { PageTemplate } from "@rst/components/anmeldung/pages/PageTemplate";
import { createMemo, For, Match, Show, Switch, type JSX } from "solid-js";
import { createStore, type Store } from "solid-js/store";
import { Button } from "@common/components/Button";
import { Checkbox } from "@common/components/Checkbox";
import { Icon } from "@common/components/Icon";
import { Box } from "@common/components/Box";
import {
  getHours,
  type PerDay,
  type ProgramDay,
} from "@rst/components/anmeldung/utils/time";
import {
  collectPairsToObject,
  getNumberedKeys,
} from "@common/components/utils";
import { gameTags } from "@rst/components/anmeldung/constant/tags";
import {
  openingHours,
  type OpeningHours,
} from "@rst/components/anmeldung/constant/hours";
import { TXT } from "@rst/components/anmeldung/constant/texts";
import {
  DESCR_LONG_MAX_CHAR,
  DESCR_SHORT_MAX_CHAR,
  validateGameround,
} from "@rst/components/anmeldung/forms/validation";
import {
  NumberInputField,
  TextareaField,
  TextInputField,
} from "@rst/components/anmeldung/forms/Components";
import type { GameroundEditClient } from "@rst/components/anmeldung/api/gameround-edit";
import type { TimeSlot } from "@rst/components/anmeldung/api/shared";
import { Dialog } from "@common/components/Dialog";

export function FindGameround(props: {
  allRounds: Store<GameroundEditClient[]>;
  uuid: string;
  fallback?: JSX.Element;
  children: (item: Store<GameroundEditClient>) => JSX.Element;
}): JSX.Element {
  const gameround = props.allRounds.find((gr) => gr.uuid === props.uuid);

  return (
    <Show fallback={props.fallback} when={gameround}>
      {(gr) => props.children(gr())}
    </Show>
  );
}

export function EditGamePage(props: {
  store: Store<GameroundEditClient>;
  changePage: ChangePageFn;
}): JSX.Element {
  const [store, setStore] = createStore(props.store);
  const errors = createMemo(() => validateGameround(store));

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

    props.changePage({ kind: "GAMEMASTER" });
  }
  return (
    <PageTemplate title="Spielrunde editieren" changePage={props.changePage}>
      <GameroundForm
        store={props.store}
        onSubmit={onSubmit}
        onCancel={() => {
          props.changePage({ kind: "GAMEMASTER" });
        }}
      />
    </PageTemplate>
  );
}

function GameroundForm(props: {
  store: Store<GameroundEditClient>;
  onSubmit: (e: Event) => void;
  onCancel: () => void;
}): JSX.Element {
  const [store] = createStore(props.store);
  const errors = createMemo(() => validateGameround(store));

  return (
    <form onSubmit={props.onSubmit} novalidate>
      <TextInputField
        store={store.title}
        label="Titel"
        name="title"
        errors={errors().titleMissing ? [TXT.mandatoryField] : []}
      />
      <TextInputField
        store={store.system}
        label="System (optional)"
        name="System"
      />
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">
        <NumberInputField
          store={store.playerCount.min}
          label="Anzahl Mitspielende (Minimum)"
          name="playerCountMin"
          min={1}
          max={store.playerCount.max.value}
        />
        <NumberInputField
          store={store.playerCount.max}
          label="Anzahl Mitspielende (Maximum)"
          name="playerCountMax"
          min={store.playerCount.min.value}
        />
      </div>
      <TextareaField
        store={store.description.short}
        label="kurze Beschreibung"
        name="descriptionShort"
        size="sm"
        errors={
          errors().descriptionShortMissing
            ? [TXT.mandatoryField]
            : errors().descriptionShortTooLong
              ? [TXT.charLimitBy.replace("{}", String(DESCR_SHORT_MAX_CHAR))]
              : []
        }
      />
      <TextareaField
        store={store.description.long}
        label="lange Beschreibung (optional)"
        name="descriptionLong"
        errors={
          errors().descriptionLongTooLong
            ? [TXT.charLimitBy.replace("{}", String(DESCR_LONG_MAX_CHAR))]
            : []
        }
      />
      <fieldset>
        <legend>Zeitslots</legend>
        <TimeSlots store={props.store.slots} />
        <Show when={errors().slotMissing}>
          <br />
          <br />
          <Box type="danger">Wähle mindestens einen Zeitslot aus.</Box>
        </Show>
      </fieldset>
      <fieldset>
        <legend>Kategorien (optional)</legend>
        <Tags store={store.tagNames} />
      </fieldset>
      <Show when={errors().hasErrors}>
        <Box type="danger">
          <h4>Spielrunde inkomplett</h4>
          Du hast noch einen oder mehre Fehler/fehlende Informationen in dieser
          Spielrunde (siehe oben). Du kannst die Spielrunde als Entwurf
          speichern und später vervollständigen. Die Spielrunde wird erst
          veröffentlicht, wenn alle Informationen komplett sind.
          <div style="margin-top: 1rem; display: flex; justify-content: flex-end;">
            <Button
              kind="success"
              label="Spielrunde als Entwurf speichern"
              onClick={props.onSubmit}
            />
          </div>
        </Box>
      </Show>
      <div style="display: flex; flex-wrap: wrap; gap: 1rem; justify-content: space-between;">
        <Button kind="danger" label="Zurück" onClick={() => props.onCancel()} />
        <div style="display: flex; flex-wrap: wrap; gap: 1rem;">
          <Button
            kind="danger"
            label="Löschen"
            onClick={() => props.onCancel()}
          />
          <Button
            type="submit"
            kind={errors().hasErrors ? "gray" : "success"}
            disabled={errors().hasErrors}
            label="Spielrunde veröffentlichen"
          />
        </div>
      </div>
    </form>
  );
}

/*
 * Tags
 */

function Tags(props: { store: Store<string[]> }): JSX.Element {
  const [store, setStore] = createStore(props.store);
  return (
    <>
      <div style="display: grid; gap: 0.5rem; margin-block-end: 1rem;">
        <For each={gameTags}>
          {(gameTag) => (
            <Checkbox
              label={gameTag.label}
              description={gameTag.description}
              checked={store.includes(gameTag.name)}
              name={gameTag.name}
              value={gameTag.name}
              onValueUpdate={(checked) => {
                if (checked) {
                  setStore(store.concat([gameTag.name]));
                } else {
                  setStore(store.filter((t) => t !== gameTag.name));
                }
              }}
            />
          )}
        </For>
      </div>
      <Box>{TXT.tagIdeas}</Box>
    </>
  );
}

/*
 * Slots
 */

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

function groupByDay(slots: TimeSlot[]): PerDay<TimeSlot[]> {
  const { SATURDAY, SUNDAY } = Object.groupBy(slots, (slot) => slot.day);
  return { SATURDAY: SATURDAY ?? [], SUNDAY: SUNDAY ?? [] };
}

function TimeSlots(props: { store: Store<TimeSlot[]> }): JSX.Element {
  const [store, setStore] = createStore(props.store);

  const daySections = createMemo(() => calculateDaySections(openingHours));
  const days = createMemo(() => groupByDay(store));

  function addTimeSlot(newSlot: TimeSlot) {
    setStore(store.concat(newSlot));
  }
  function removeTimeSlot(slotUuid: string) {
    setStore(store.filter((s) => s.uuid !== slotUuid));
  }
  return (
    <>
      <TimeSlotChooser
        daySections={daySections()}
        chooseTimeSlot={addTimeSlot}
      />
      <Show when={days().SATURDAY.length > 0}>
        <h6>Samstag, 23. August 2025</h6>
        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
          <For each={days().SATURDAY}>
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
                onClick={() => removeTimeSlot(slot.uuid)}
              />
            )}
          </For>
        </div>
      </Show>
      <Show when={days().SUNDAY.length > 0}>
        <h6>Sonntag, 24. August 2025</h6>
        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
          <For each={days().SUNDAY}>
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
                onClick={() => removeTimeSlot(slot.uuid)}
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
  chooseTimeSlot: (slot: TimeSlot) => void;
}): JSX.Element {
  const [store, setStore] = createStore<{
    slot: SlotState;
    dialog: { open: boolean };
  }>({
    slot: {
      kind: "CHOOSE_DAY",
    },
    dialog: { open: false },
  });

  function resetDialog(): void {
    setStore("slot", { kind: "CHOOSE_DAY" });
    setStore("dialog", "open", false);
  }

  function createTimeSlot(slot: TimeSlot): void {
    props.chooseTimeSlot(slot);
    resetDialog();
  }

  return (
    <>
      <Button
        kind="success"
        label={
          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center;">
            <Icon icon="circle-plus" /> <span>Neuen Slot erfassen</span>
          </div>
        }
        onClick={() => setStore("dialog", "open", true)}
      />
      <Dialog
        title="Zeitslot erfassen"
        store={store.dialog}
        size="medium"
        onClose={resetDialog}
      >
        <Switch>
          <Match when={store.slot.kind === "CHOOSE_DAY"}>
            <div style="display: grid; gap: 0.5rem;">
              <DayChooser
                changeDay={(day) =>
                  setStore("slot", { kind: "CHOOSE_START", day })
                }
              />
            </div>
          </Match>
          <Match when={store.slot.kind === "CHOOSE_START"}>
            <div style="display: grid; gap: 0.5rem;">
              <DayChooser
                chosenDay={
                  store.slot.kind === "CHOOSE_START"
                    ? store.slot.day
                    : undefined
                }
                changeDay={(day) =>
                  setStore("slot", { kind: "CHOOSE_START", day })
                }
              />
              <StartChooser
                startTimes={
                  store.slot.kind === "CHOOSE_START"
                    ? getNumberedKeys(props.daySections[store.slot.day])
                    : []
                }
                changeStart={(hour) =>
                  setStore("slot", { kind: "CHOOSE_END", start: hour })
                }
              />
            </div>
          </Match>
          <Match when={store.slot.kind === "CHOOSE_END"}>
            <div style="display: grid; gap: 0.5rem;">
              <DayChooser
                chosenDay={
                  store.slot.kind === "CHOOSE_END" ? store.slot.day : undefined
                }
                changeDay={(day) =>
                  setStore("slot", { kind: "CHOOSE_START", day })
                }
              />
              <StartChooser
                chosenStart={
                  store.slot.kind === "CHOOSE_END"
                    ? store.slot.start
                    : undefined
                }
                startTimes={
                  store.slot.kind === "CHOOSE_END"
                    ? getNumberedKeys(props.daySections[store.slot.day])
                    : []
                }
                changeStart={(hour) =>
                  setStore("slot", { kind: "CHOOSE_END", start: hour })
                }
              />
              <EndChooser
                endTimes={
                  store.slot.kind === "CHOOSE_END"
                    ? (props.daySections[store.slot.day][store.slot.start] ??
                      [])
                    : []
                }
                changeEnd={(hour) => {
                  if (store.slot.kind === "CHOOSE_END") {
                    setStore("slot", {
                      kind: "WAIT_FOR_CONFIRMATION",
                      day: store.slot.day,
                      start: store.slot.start,
                      end: hour,
                    });
                  }
                }}
              />
            </div>
          </Match>
          <Match when={store.slot.kind === "WAIT_FOR_CONFIRMATION"}>
            <div style="display: grid; gap: 0.5rem;">
              <DayChooser
                chosenDay={
                  store.slot.kind === "WAIT_FOR_CONFIRMATION"
                    ? store.slot.day
                    : undefined
                }
                changeDay={(day) =>
                  setStore("slot", { kind: "CHOOSE_START", day })
                }
              />
              <StartChooser
                chosenStart={
                  store.slot.kind === "WAIT_FOR_CONFIRMATION"
                    ? store.slot.start
                    : undefined
                }
                startTimes={
                  store.slot.kind === "WAIT_FOR_CONFIRMATION"
                    ? getNumberedKeys(props.daySections[store.slot.day])
                    : []
                }
                changeStart={(hour) =>
                  setStore("slot", { kind: "CHOOSE_END", start: hour })
                }
              />
              <EndChooser
                chosenEnd={
                  store.slot.kind === "WAIT_FOR_CONFIRMATION"
                    ? store.slot.end
                    : undefined
                }
                endTimes={
                  store.slot.kind === "WAIT_FOR_CONFIRMATION"
                    ? (props.daySections[store.slot.day][store.slot.start] ??
                      [])
                    : []
                }
                changeEnd={(hour) => {
                  if (store.slot.kind === "WAIT_FOR_CONFIRMATION") {
                    setStore("slot", {
                      kind: "WAIT_FOR_CONFIRMATION",
                      day: store.slot.day,
                      start: store.slot.start,
                      end: hour,
                    });
                  }
                }}
              />
              <div style="margin-block-start: 1rem;">
                <Button
                  label={`Slot "${store.slot.kind === "WAIT_FOR_CONFIRMATION" ? `${TXT.days[store.slot.day]}, von ${store.slot.start} bis ${store.slot.end} Uhr` : ""}" erstellen`}
                  kind="success"
                  onClick={() => {
                    if (store.slot.kind === "WAIT_FOR_CONFIRMATION") {
                      createTimeSlot({
                        uuid: crypto.randomUUID(),
                        day: store.slot.day,
                        from: store.slot.start,
                        to: store.slot.end,
                      });
                    }
                  }}
                />
              </div>
            </div>
          </Match>
        </Switch>
      </Dialog>
    </>
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
