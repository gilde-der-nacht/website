import { type Resource } from "solid-js";
import type { ChangePageFn } from "@rst/components/anmeldung/Router";
import { PageTemplate } from "@rst/components/anmeldung/pages/PageTemplate";
import { createMemo, For, Show, type JSX } from "solid-js";
import { createStore, type Store } from "solid-js/store";
import { ButtonWithIcon } from "@common/components/Button";
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
import { TimeSlotPart } from "@rst/components/anmeldung/components/TimeSlotPart";
import type { RegistrationsClient } from "@rst/components/anmeldung/api/registrations";
import type { Result } from "@rst/components/anmeldung/api/utils";
import { Chip } from "@common/components/Chip";
import { Dialog, type DialogStore } from "@common/components/Dialog";

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
  registrations: Resource<Result<RegistrationsClient>>;
  changePage: ChangePageFn;
}): JSX.Element {
  const [store, setStore] = createStore(props.store);
  const [dialogStore, setDialogStore] = createStore<{
    delete: DialogStore;
    publish: DialogStore;
  }>({
    delete: {
      open: false,
    },
    publish: {
      open: false,
    },
  });

  function onSubmit(e: Event): void {
    e.preventDefault();
    setDialogStore("publish", "open", true);
  }

  function goBack(): void {
    props.changePage({ kind: "GAMEMASTER" });
  }

  return (
    <PageTemplate title="Spielrunde editieren" changePage={props.changePage}>
      <Chip kind="special">Status: {TXT.publishingSteps[store.kind]}</Chip>
      <br />
      <br />
      <GameroundForm
        store={store}
        registrations={props.registrations}
        onSubmit={onSubmit}
        onCancel={() => setDialogStore("delete", "open", true)}
        goBack={goBack}
      />
      <Dialog
        store={dialogStore.publish}
        title="Spielrunde veröffentlichen"
        onClose={() => {}}
      >
        <div class="content">
          <p>Möchtest du diese Spielrunde gerne veröffentlichen?</p>
          <ButtonWithIcon
            kind="success"
            icon="circle-plus"
            label={`Ja, bitte "${store.title.value || "[" + TXT.missingTitle + "]"}" veröffentlichen.`}
            onClick={() => {
              setStore("kind", "PUBLISHED");
              setDialogStore("publish", "open", false);
            }}
          />
        </div>
      </Dialog>
      <Dialog
        store={dialogStore.delete}
        title="Spielrunde löschen"
        onClose={() => {}}
      >
        <Show when={store.slots.length > 0}>
          <em>
            Du kannst die Spielrunde nur löschen, wenn du zuerst alle Zeitslots
            entfernt hast.
          </em>
        </Show>
        <Show when={store.slots.length === 0}>
          <div class="content">
            <p>Bist du sicher, dass du die Spielrunde löschen möchtest?</p>
            <ButtonWithIcon
              kind="danger"
              icon="trash"
              label={`Ja, bitte "${store.title.value || "[" + TXT.missingTitle + "]"}" löschen.`}
              onClick={() => {
                setStore("kind", "DELETED");
                props.changePage({ kind: "GAMEMASTER" });
              }}
            />
          </div>
        </Show>
      </Dialog>
    </PageTemplate>
  );
}

function GameroundForm(props: {
  store: Store<GameroundEditClient>;
  registrations: Resource<Result<RegistrationsClient>>;
  onSubmit: (e: Event) => void;
  onCancel: () => void;
  goBack: () => void;
}): JSX.Element {
  const [store] = createStore(props.store);
  const errors = createMemo(() => validateGameround(store));

  return (
    <form onSubmit={props.onSubmit} novalidate>
      <TextInputField
        store={store.title}
        label="Titel"
        name="title"
        showErrors={store.kind === "PUBLISHED" ? "ALWAYS" : "ON_BLUR"}
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
        showErrors={store.kind === "PUBLISHED" ? "ALWAYS" : "ON_BLUR"}
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
        showErrors={store.kind === "PUBLISHED" ? "ALWAYS" : "ON_BLUR"}
        errors={
          errors().descriptionLongTooLong
            ? [TXT.charLimitBy.replace("{}", String(DESCR_LONG_MAX_CHAR))]
            : []
        }
      />
      <TimeSlotPart
        store={props.store.slots}
        registrations={props.registrations}
        slotMissing={errors().slotMissing}
      />
      <fieldset>
        <legend>Kategorien (optional)</legend>
        <Tags store={store.tagNames} />
      </fieldset>
      <Show when={errors().hasErrors}>
        <Box type="danger">
          <h4>Spielrunde inkomplett</h4>
          <p>
            Du hast noch einen oder mehre Fehler/fehlende Informationen in
            dieser Spielrunde:
          </p>
          <ul>
            <Show when={errors().titleMissing}>
              <li>"Titel" ist ein Pflichtfeld.</li>
            </Show>
            <Show when={errors().descriptionShortMissing}>
              <li>"kurz Beschreibung" ist ein Pflichtfeld.</li>
            </Show>
            <Show when={errors().descriptionShortTooLong}>
              <li>"kurz Beschreibung" ist zu lang.</li>
            </Show>
            <Show when={errors().descriptionLongTooLong}>
              <li>"lange Beschreibung" ist zu lang.</li>
            </Show>
            <Show when={errors().slotMissing}>
              <li>Mindest einen Zeitslot muss ausgewählt werden.</li>
            </Show>
          </ul>
        </Box>
      </Show>
      <div style="display: flex; flex-wrap: wrap; gap: 1rem; justify-content: space-between;">
        <ButtonWithIcon
          icon="backward"
          label="Zurück zu deinen Spielrunden"
          onClick={props.goBack}
        />
        <div style="display: flex; flex-wrap: wrap; gap: 1rem;">
          <ButtonWithIcon
            icon="trash"
            kind="danger"
            label="Löschen"
            onClick={() => props.onCancel()}
          />
          <Show when={store.kind === "DRAFT"}>
            <ButtonWithIcon
              icon="circle-plus"
              type="submit"
              kind={errors().hasErrors ? "gray" : "success"}
              disabled={errors().hasErrors}
              label="Spielrunde veröffentlichen"
            />
          </Show>
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
