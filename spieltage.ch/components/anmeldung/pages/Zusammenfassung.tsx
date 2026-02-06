import { createMemo, Show, type JSX, type Resource } from "solid-js";
import { createStore, type Store } from "solid-js/store";
import { Box } from "@common/components/Box";
import {
  Dialog,
  initDialogStore,
  type DialogStore,
} from "@common/components/Dialog";
import { Button, ButtonWithIcon } from "@common/components/Button";
import { TextInputField } from "@common/components/Components";
import { TXT } from "@common/utils/texts";
import { initTextInput } from "@common/components/form";
import type { Contact, Save } from "@lst/components/anmeldung/api/save";
import { elysium } from "@common/components/utils";
import { z } from "astro/zod";
import { useSearchParams } from "@solidjs/router";
import { Checkbox } from "@common/components/Checkbox";
import type { Result } from "@lst/components/anmeldung/api/elysium";
import type { Public } from "@lst/components/anmeldung/api/public";

export function Zusammenfassung(props: {
  store: Store<Save>;
  publicResource: Resource<Result<Public>>;
  isEditable: boolean;
}): JSX.Element {
  const [store, setStore] = createStore(props.store);
  return (
    <div style="display: grid; gap: 1rem;">
      <Contact store={props.store.contact} isEditable={props.isEditable} />
      <Checkbox
        label="Schickt mir bitte E-Mails, wenn neue Programmpunkte veröffentlicht werden."
        checked={store.config.wantsUpdates}
        name="wantsUpdates"
        value="wantsUpdates"
        onValueUpdate={(checked) => {
          setStore("config", "wantsUpdates", checked);
        }}
      />
      <Box type="special">Eine persöhnliche Zusammenfassung folgt noch.</Box>
    </div>
  );
}

function Contact(props: {
  store: Store<Contact>;
  isEditable: boolean;
}): JSX.Element {
  const [_, setStore] = createStore(props.store);
  const [dialogStore, setDialogStore] = createStore(initDialogStore());

  return (
    <Box>
      {
        // Show not really necesary, but I have some bug where the contact edit dialog does not get reset when closed. This is the hacky, fast solution for now.
      }
      <Show when={dialogStore.open}>
        <ContactEditDialog
          dialogStore={dialogStore}
          currentState={props.store}
          updateCurrentState={setStore}
        />
      </Show>
      <div style="display: grid; gap: 1rem;">
        <h3>Meine Kontaktdaten</h3>
        <p>
          <strong>Name:</strong> {props.store.name}
        </p>
        <p>
          <strong>E-Mail:</strong> {props.store.email}
        </p>
        <p>
          <strong>Handynummer:</strong> {props.store.mobile}
        </p>

        <Show when={props.isEditable}>
          <div>
            <ButtonWithIcon
              icon="pencil"
              label="Kontaktdaten editieren"
              onClick={() => setDialogStore("open", true)}
            />
          </div>
        </Show>
      </div>
    </Box>
  );
}

type EmailDuplicateStore =
  | {
      kind: "CHECKING";
    }
  | {
      kind: "IDLE";
      isDuplicate: boolean;
    };

function ContactEditDialog(props: {
  dialogStore: Store<DialogStore>;
  currentState: Contact;
  updateCurrentState: (newState: Contact) => void;
}): JSX.Element {
  const [searchParams] = useSearchParams();

  const [formStore] = createStore({
    name: initTextInput(props.currentState.name),
    email: initTextInput(props.currentState.email),
    mobile: initTextInput(props.currentState.mobile),
  });

  const [emailIsDuplicate, setEmailIsDuplicate] =
    createStore<EmailDuplicateStore>({
      kind: "IDLE",
      isDuplicate: false,
    });

  const errors = createMemo(() => {
    const err: { name: string[]; email: string[] } = {
      name: [],
      email: [],
    };

    if (formStore.name.value.trim().length === 0) {
      err.name.push(TXT.mandatoryField);
    }

    if (formStore.email.value.trim().length === 0) {
      err.email.push(TXT.mandatoryField);
    } else if (!formStore.email.value.includes("@")) {
      err.email.push(TXT.invalidEmail);
    }

    if (emailIsDuplicate.kind === "IDLE" && emailIsDuplicate.isDuplicate) {
      err.email.push("Diese E-Mail wird bereits verwendet.");
    }

    return { ...err, hasErrors: err.name.length + err.email.length > 0 };
  });

  const [_, setDialogStore] = createStore(props.dialogStore);

  return (
    <Dialog
      store={props.dialogStore}
      title="Kontaktdaten editieren"
      onClose={() => {}}
      size="medium"
    >
      <form novalidate>
        <TextInputField
          store={formStore.name}
          label="Name"
          name="name"
          showErrors="ON_BLUR"
          errors={errors().name}
        />
        <TextInputField
          store={formStore.email}
          label="E-Mail"
          name="email"
          showErrors="ALWAYS"
          errors={errors().email}
          onUpdate={() =>
            setEmailIsDuplicate({ kind: "IDLE", isDuplicate: false })
          }
        />
        <TextInputField
          store={formStore.mobile}
          label="Handynummer"
          name="mobile"
        />
        <Button
          label="Speichern"
          disabled={errors().hasErrors || emailIsDuplicate.kind === "CHECKING"}
          onClick={async () => {
            if (!errors().hasErrors) {
              setEmailIsDuplicate({ kind: "CHECKING" });

              const secret = searchParams["secret"];
              const result = await fetch(
                elysium(
                  `/lst26/check-email?email=${formStore.email.value}&secret=${secret}`,
                ),
              );

              if (!result.ok) {
                setEmailIsDuplicate({ kind: "IDLE", isDuplicate: true });
                return;
              }

              const data = (await result.json()) as unknown;
              const parsed = checkEmailDuplicateSchema.safeParse(data);
              if (!parsed.success) {
                setEmailIsDuplicate({ kind: "IDLE", isDuplicate: true });
                return;
              }

              if (parsed.data.kind === "FAILURE") {
                setEmailIsDuplicate({ kind: "IDLE", isDuplicate: true });
                return;
              }

              setEmailIsDuplicate({ kind: "IDLE", isDuplicate: false });

              props.updateCurrentState({
                name: formStore.name.value,
                email: formStore.email.value,
                mobile: formStore.mobile.value,
              });

              setDialogStore("open", false);
            }
          }}
        />
      </form>
    </Dialog>
  );
}

const checkEmailDuplicateSchema = z.union([
  z.object({ kind: z.literal("SUCCESS") }),
  z.object({ kind: z.literal("FAILURE") }),
]);
