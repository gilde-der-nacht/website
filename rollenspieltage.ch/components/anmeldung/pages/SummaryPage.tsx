import { Box } from "@common/components/Box";
import { createMemo, type JSX } from "solid-js";
import { createStore, type Store } from "solid-js/store";
import type {
  ContactClient,
  SaveClient,
} from "@rst/components/anmeldung/api/save";
import { Button, ButtonWithIcon } from "@common/components/Button";
import { Dialog, initDialogStore } from "@common/components/Dialog";
import { TextInputField } from "@rst/components/anmeldung/forms/Components";
import { TXT } from "@rst/components/anmeldung/constant/texts";
import { initTextInput } from "../api/form";

export function SummaryPage(props: { store: Store<SaveClient> }): JSX.Element {
  return (
    <>
      <Contact store={props.store.init} />
      <Box type="danger">
        <p>Hier folgt später eine Gesamtübersicht über deinen Programmplan.</p>
      </Box>
    </>
  );
}

function Contact(props: { store: Store<ContactClient> }): JSX.Element {
  const [_, setStore] = createStore(props.store);
  const [formStore, setFormStore] = createStore({
    name: initTextInput(props.store.name),
    email: initTextInput(props.store.email),
    mobile: initTextInput(props.store.mobile),
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

  const [dialogStore, setDialogStore] = createStore(initDialogStore());

  return (
    <>
      <Dialog
        store={dialogStore}
        title="Kontaktdaten editieren"
        onClose={() => {
          console.log("close");
          setFormStore({
            name: initTextInput(props.store.name),
            email: initTextInput(props.store.email),
            mobile: initTextInput(props.store.mobile),
          });
        }}
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
                setStore({
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
      <div style="display: grid; gap: 1rem; margin-block-end: 2rem;">
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

        <div>
          <ButtonWithIcon
            icon="pencil"
            label="Kontakdaten editieren"
            onClick={() => setDialogStore("open", true)}
          />
        </div>
      </div>
    </>
  );
}
