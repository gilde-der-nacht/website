import { createMemo, Show, type JSX } from "solid-js";
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

export function Zusammenfassung(props: {
  store: Store<Save>;
  isEditable: boolean;
}): JSX.Element {
  return <Contact store={props.store.contact} isEditable={props.isEditable} />;
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
function ContactEditDialog(props: {
  dialogStore: Store<DialogStore>;
  currentState: Contact;
  updateCurrentState: (newState: Contact) => void;
}): JSX.Element {
  const [formStore] = createStore({
    name: initTextInput(props.currentState.name),
    email: initTextInput(props.currentState.email),
    mobile: initTextInput(props.currentState.mobile),
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
          showErrors="ON_BLUR"
          errors={errors().email}
        />
        <TextInputField
          store={formStore.mobile}
          label="Handynummer"
          name="mobile"
        />
        <Button
          label="Speichern"
          disabled={errors().hasErrors}
          onClick={() => {
            if (!errors().hasErrors) {
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
