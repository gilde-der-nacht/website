import { createMemo, For, Match, Show, Switch, type JSX } from "solid-js";
import { createStore, type Store } from "solid-js/store";
import { Button } from "@common/components/Button";
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
import {
  openingHours,
  type OpeningHours,
} from "@rst/components/anmeldung/constant/hours";
import { TXT } from "@rst/components/anmeldung/constant/texts";
import type { TimeSlot } from "@rst/components/anmeldung/api/shared";
import { Dialog } from "@common/components/Dialog";

export function TimeSlotPart(props: {
  store: Store<TimeSlot[]>;
  slotMissing: boolean;
}): JSX.Element {
  return (
    <fieldset>
      <legend>Zeitslots</legend>
      <TimeSlots store={props.store} />
      <Show when={props.slotMissing}>
        <br />
        <br />
        <Box type="danger">Wähle mindestens einen Zeitslot aus.</Box>
      </Show>
    </fieldset>
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
