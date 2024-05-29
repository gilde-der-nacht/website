import type { JSX } from "solid-js/jsx-runtime";
import { Input, InputWithRef } from "common/components/Input.tsx";
import { createStore } from "solid-js/store";
import { Button } from "@common/components/Button";
import { Show } from "solid-js";
import { Box } from "@common/components/Box";

export function Anmeldung(): JSX.Element {
  const [store, setStore] = createStore({
    form: {
      name: "",
      email: "",
      tel: "",
    },
    showErrors: {
      nameMissing: false,
      emailMissing: false,
      emailInvalid: false,
    },
  });

  let emailField!: HTMLInputElement;

  function onSubmit(e: SubmitEvent): void {
    e.preventDefault();
    const nameIsMissing = store.form.name.trim().length === 0;
    setStore("showErrors", "nameMissing", nameIsMissing);

    const emailIsMissing = store.form.email.trim().length === 0;
    setStore("showErrors", "emailMissing", emailIsMissing);

    const emailIsInvalid = emailField.validity.typeMismatch;
    setStore("showErrors", "emailInvalid", emailIsInvalid);

    if (
      store.showErrors.nameMissing ||
      store.showErrors.emailMissing ||
      store.showErrors.emailInvalid
    ) {
      // Show errors, do not continue
      return;
    }
    console.log("Form valid");
  }

  return (
    <>
      <h1>Anmeldung 2024</h1>
      <p>Melde dich jetzt für die Luzerner Rollenspieltage 2024 an.</p>
      <br />
      <form onSubmit={onSubmit} novalidate>
        <Input
          label="Name"
          name="name"
          value={store.form.name}
          onValueUpdate={(newValue) => {
            setStore("form", "name", newValue);
            setStore("showErrors", "nameMissing", false);
          }}
        />
        <Show when={store.showErrors.nameMissing}>
          <Box type="danger">Dies ist ein Pflichtfeld.</Box>
        </Show>
        <InputWithRef
          label="E-Mail"
          name="email"
          type="email"
          value={store.form.email}
          onValueUpdate={(newValue) => {
            setStore("form", "email", newValue);
            setStore("showErrors", "emailMissing", false);
            setStore("showErrors", "emailInvalid", false);
          }}
          ref={emailField}
        />
        <Show when={store.showErrors.emailMissing}>
          <Box type="danger">Dies ist ein Pflichtfeld.</Box>
        </Show>
        <Show when={store.showErrors.emailInvalid}>
          <Box type="danger">
            Die Eingabe scheint keine gültige E-Mail-Adresse zu sein.
          </Box>
        </Show>
        <Input
          label="Handynummer"
          name="tel"
          type="tel"
          value={store.form.tel}
          required={false}
          onValueUpdate={(newValue) => setStore("form", "tel", newValue)}
        />
        <Button type="submit" label="Anmeldung starten" />
      </form>
    </>
  );
}
