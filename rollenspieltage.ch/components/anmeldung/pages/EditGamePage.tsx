import { Match, Switch, type Resource } from "solid-js";
import type { ChangePageFn } from "@rst/components/anmeldung/Router";
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
  UPDATE_MAX_CHAR,
  validateGameround,
  validateUpdateText,
  type GameroundEditErrors,
} from "@rst/components/anmeldung/forms/validation";
import {
  NumberInputField,
  TextareaField,
  TextInputField,
} from "@rst/components/anmeldung/forms/Components";
import type { GameroundEditClient } from "@rst/components/anmeldung/api/gameround-edit";
import { TimeSlotPart } from "@rst/components/anmeldung/components/TimeSlotPart";
import type {
  ReservationClient,
  ReservationsClient,
} from "@rst/components/anmeldung/api/reservations";
import type { Result } from "@rst/components/anmeldung/api/utils";
import { Chip } from "@common/components/Chip";
import {
  Dialog,
  initDialogStore,
  type DialogStore,
} from "@common/components/Dialog";
import type { Queue } from "@common/components/utils";
import {
  queueSendGameroundUpdate,
  queueuPublishGameround,
  type EmailQueueableFns,
} from "@rst/components/anmeldung/api/email";

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
  registrations: Resource<Result<ReservationsClient>>;
  queue: Queue<EmailQueueableFns>;
  changePage: ChangePageFn;
}): JSX.Element {
  const [store, setStore] = createStore(props.store);
  const [dialogStore, setDialogStore] = createStore<{
    delete: DialogStore;
    publish: DialogStore;
    sendUpdate: DialogStore;
  }>({
    delete: initDialogStore(),
    publish: initDialogStore(),
    sendUpdate: initDialogStore(),
  });

  function onSubmit(e: Event): void {
    e.preventDefault();
    setDialogStore("publish", "open", true);
  }

  function goBack(): void {
    props.changePage({ kind: "GAMEMASTER" });
  }

  return (
    <>
      <Chip kind="special">Status: {TXT.publishingSteps[store.kind]}</Chip>
      <br />
      <br />
      <GameroundForm
        store={store}
        registrations={props.registrations}
        onSubmit={onSubmit}
        onCancel={() => setDialogStore("delete", "open", true)}
        onSendUpdate={() => setDialogStore("sendUpdate", "open", true)}
        goBack={goBack}
      />
      <PublishDialog
        store={dialogStore.publish}
        title={store.title.value}
        onPublish={() => {
          setStore("kind", "published");
          setDialogStore("publish", "open", false);
          props.queue.enqueue(queueuPublishGameround(store.uuid));
        }}
      />
      <SendUpdateDialog
        store={dialogStore.sendUpdate}
        players={getPlayers(
          props.registrations,
          store.slots.map((slot) => slot.uuid),
        )}
        onSend={(text) => {
          props.queue.enqueue(
            queueSendGameroundUpdate(
              text,
              store.slots.map((slot) => slot.uuid),
            ),
          );
        }}
      />
      <DeleteDialog
        store={dialogStore.delete}
        hasSlots={store.slots.length !== 0}
        title={store.title.value}
        onDelete={() => {
          setStore("kind", "deleted");
          props.changePage({ kind: "GAMEMASTER" });
        }}
      />
    </>
  );
}

function PublishDialog(props: {
  store: Store<DialogStore>;
  title: string;
  onPublish: () => void;
}): JSX.Element {
  return (
    <Dialog
      store={props.store}
      title="Spielrunde veröffentlichen"
      onClose={() => {}}
    >
      <div class="content">
        <p>Möchtest du diese Spielrunde gerne veröffentlichen?</p>
        <ButtonWithIcon
          kind="success"
          icon="circle-plus"
          label={`Ja, bitte "${props.title || "[" + TXT.missingTitle + "]"}" veröffentlichen.`}
          onClick={props.onPublish}
        />
      </div>
    </Dialog>
  );
}

function SendUpdateDialog(props: {
  store: Store<DialogStore>;
  players: Players;
  onSend: (text: string) => void;
}): JSX.Element {
  return (
    <Dialog
      store={props.store}
      title="Update senden"
      onClose={() => {}}
      size="medium"
    >
      <>
        {() => {
          if (props.players.kind === "LOADING") {
            return (
              <em>Informationen zu den Anmeldungen müssen geladen werden...</em>
            );
          }
          if (props.players.kind === "ERROR") {
            return <>{TXT.error.general}</>;
          }
          if (props.players.data.length === 0) {
            return (
              <em>
                Du kannst kein Update versenden, da sich noch niemand für diese
                Spielrunde angemeldet hat.
              </em>
            );
          }
          return (
            <>
              <p>
                An: {props.players.data.map((player) => player.name).join(", ")}
              </p>
              <br />
              <SendUpdateForm onSend={props.onSend} />
            </>
          );
        }}
      </>
    </Dialog>
  );
}

function DeleteDialog(props: {
  store: Store<DialogStore>;
  hasSlots: boolean;
  title: string;
  onDelete: () => void;
}): JSX.Element {
  return (
    <Dialog store={props.store} title="Spielrunde löschen" onClose={() => {}}>
      <Show when={props.hasSlots}>
        <em>
          Du kannst die Spielrunde nur löschen, wenn du zuerst alle Zeitslots
          entfernt hast.
        </em>
      </Show>
      <Show when={!props.hasSlots}>
        <div class="content">
          <p>Bist du sicher, dass du die Spielrunde löschen möchtest?</p>
          <ButtonWithIcon
            kind="danger"
            icon="trash"
            label={`Ja, bitte "${props.title || "[" + TXT.missingTitle + "]"}" löschen.`}
            onClick={props.onDelete}
          />
        </div>
      </Show>
    </Dialog>
  );
}

function GameroundForm(props: {
  store: Store<GameroundEditClient>;
  registrations: Resource<Result<ReservationsClient>>;
  onSubmit: (e: Event) => void;
  onCancel: () => void;
  onSendUpdate: () => void;
  goBack: () => void;
}): JSX.Element {
  const [store] = createStore(props.store);
  const errors = createMemo(() => validateGameround(store));

  return (
    <form novalidate>
      <Show when={store.kind === "published"}>
        <ErrorSummary errors={errors()} />
      </Show>
      <TextInputField
        store={store.title}
        label="Titel"
        name="title"
        showErrors={store.kind === "published" ? "ALWAYS" : "ON_BLUR"}
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
        size="small"
        showErrors={store.kind === "published" ? "ALWAYS" : "ON_BLUR"}
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
        showErrors={store.kind === "published" ? "ALWAYS" : "ON_BLUR"}
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
      <ErrorSummary errors={errors()} />
      <div style="display: flex; flex-wrap: wrap; gap: 1rem; justify-content: space-between;">
        <ButtonWithIcon
          icon="backward"
          label="Zurück zu deinen Spielrunden"
          onClick={props.goBack}
        />
        <div style="display: flex; flex-wrap: wrap; gap: 1rem;">
          <Show when={store.kind !== "deleted"}>
            <ButtonWithIcon
              icon="trash"
              kind="danger"
              label="Löschen"
              onClick={() => props.onCancel()}
            />
          </Show>
          <Show when={store.kind === "draft"}>
            <ButtonWithIcon
              icon="circle-plus"
              kind={errors().hasErrors ? "gray" : "success"}
              disabled={errors().hasErrors}
              label="Spielrunde veröffentlichen"
              onClick={errors().hasErrors ? undefined : props.onSubmit}
            />
          </Show>
          <Show when={store.kind === "published"}>
            <ButtonWithIcon
              icon="circle-plus"
              kind="success"
              label="Update an Spielende schicken"
              onClick={props.onSendUpdate}
            />
          </Show>
        </div>
      </div>
    </form>
  );
}

function ErrorSummary(props: { errors: GameroundEditErrors }): JSX.Element {
  return (
    <Show when={props.errors.hasErrors}>
      <Box type="danger">
        <h4>Spielrunde inkomplett</h4>
        <p>
          Du hast noch einen oder mehre Fehler/fehlende Informationen in dieser
          Spielrunde:
        </p>
        <ul>
          <Show when={props.errors.titleMissing}>
            <li>«Titel» ist ein Pflichtfeld.</li>
          </Show>
          <Show when={props.errors.descriptionShortMissing}>
            <li>«kurz Beschreibung» ist ein Pflichtfeld.</li>
          </Show>
          <Show when={props.errors.descriptionShortTooLong}>
            <li>«kurz Beschreibung» ist zu lang.</li>
          </Show>
          <Show when={props.errors.descriptionLongTooLong}>
            <li>«lange Beschreibung» ist zu lang.</li>
          </Show>
          <Show when={props.errors.slotMissing}>
            <li>Mindest einen Zeitslot muss ausgewählt werden.</li>
          </Show>
        </ul>
      </Box>
    </Show>
  );
}

function SendUpdateForm(props: {
  onSend: (text: string) => void;
}): JSX.Element {
  const [store, setStore] = createStore({
    updateText: {
      value: "",
      isDirty: false,
    },
    hasBeenSent: false,
  });
  const errors = createMemo(() => validateUpdateText(store));
  return (
    <Switch
      fallback={
        <Box type="success">
          Nachricht wurde registriert und wird in den nächsten 24 Stunden an die
          Spielenden verschickt.
        </Box>
      }
    >
      <Match when={!store.hasBeenSent}>
        <p>
          <strong>Erklärung:</strong> Hast du eine wichtige Änderung an dieser
          Spielrunde durchgeführt, während bereits Spielende angemeldet waren?
          Lass hiermit die Angemeldeten wissen, was du geändert hast. Wichtige
          Änderungen können sein: System geändert, Kategorien geändert. Für
          kleine Änderungen, wie z.B. Rechtschreibfehler, sollte dies nicht
          genutzt werden.
        </p>
        <br />
        <p>
          <em>Halte dich kurz und am besten Stichwortartig.</em>
        </p>
        <br />
        <form novalidate={true}>
          <TextareaField
            store={store.updateText}
            label="Zusammenfassung der Änderung"
            name="updateText"
            size="small"
            showErrors="ALWAYS"
            errors={
              errors().missing
                ? [TXT.mandatoryField]
                : errors().tooLong
                  ? [TXT.charLimitBy.replace("{}", String(UPDATE_MAX_CHAR))]
                  : []
            }
          />
          <ButtonWithIcon
            icon="paper-plane"
            label="Spielende informieren"
            kind={errors().hasErrors ? "gray" : "success"}
            disabled={errors().hasErrors}
            onClick={
              errors().hasErrors
                ? undefined
                : () => {
                    props.onSend(store.updateText.value);
                    setStore("hasBeenSent", true);
                  }
            }
          />
        </form>
      </Match>
    </Switch>
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

type Players =
  | { kind: "LOADING" }
  | { kind: "ERROR" }
  | { kind: "SUCCESS"; data: ReservationClient[] };
const getPlayers = (
  registrations: Resource<Result<ReservationsClient>>,
  slotUuids: string[],
): Players => {
  if (registrations.loading) {
    return { kind: "LOADING" };
  }

  if (registrations.error) {
    return { kind: "ERROR" };
  }
  const result = registrations();
  if (result === undefined || result.kind === "FAILURE") {
    return { kind: "ERROR" };
  }
  return {
    kind: "SUCCESS",
    data: result.data.entries.filter((entry) => slotUuids.includes(entry.uuid)),
  };
};
