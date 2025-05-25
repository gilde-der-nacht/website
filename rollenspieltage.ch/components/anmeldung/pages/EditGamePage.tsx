import { batch } from "solid-js";
import type { ChangePageFn } from "@rst/components/anmeldung/Router";
import { PageTemplate } from "@rst/components/anmeldung/pages/PageTemplate";
import { createMemo, For, Show, type JSX } from "solid-js";
import { createStore, type Store } from "solid-js/store";
import { Button } from "@common/components/Button";
import { Checkbox } from "@common/components/Checkbox";
import { Box } from "@common/components/Box";
import { gameTags } from "@rst/components/anmeldung/constant/tags";
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
import { TimeSlotPart } from "../components/TimeSlotPart";

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
      <TimeSlotPart
        store={props.store.slots}
        slotMissing={errors().slotMissing}
      />
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
