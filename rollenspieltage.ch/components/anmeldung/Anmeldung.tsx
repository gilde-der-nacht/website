import { Input, InputWithRef } from "common/components/Input.tsx";
import { createStore } from "solid-js/store";
import { Button } from "@common/components/Button";
import { Show, type JSX } from "solid-js";
import { Box } from "@common/components/Box";
import { z } from "astro/zod";

type Store = {
  form: { name: string; email: string; tel: string };
  showErrors: {
    nameMissing: boolean;
    emailMissing: boolean;
    emailInvalid: boolean;
    general: boolean;
  };
  state: "IDLE" | "LOADING";
};

type StartData = {
  name: string;
  email: string;
  handynummer: string;
};

export function Anmeldung(): JSX.Element {
  const [store, setStore] = createStore<Store>({
    form: {
      name: "",
      email: "",
      tel: "",
    },
    showErrors: {
      nameMissing: false,
      emailMissing: false,
      emailInvalid: false,
      general: false,
    },
    state: "IDLE",
  });

  let emailField!: HTMLInputElement;

  async function onSubmit(e: SubmitEvent): Promise<void> {
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

    setStore("state", "LOADING");

    try {
      const data: StartData = {
        name: store.form.name,
        email: store.form.email,
        handynummer: store.form.tel,
      };
      const response = await fetch(
        "https://elysium.gildedernacht.ch/rst24/start",
        {
          method: "post",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        setStore("showErrors", "general", true);
      } else {
        const json = await response.json();
        const schema = z.object({
          name: z.string(),
          email: z.string(),
          registrationId: z.number(),
          secret: z.string(),
        });
        const data = schema.parse(json);
        const redirect = new URL(location.origin + "/meine-anmeldung");
        redirect.searchParams.append("secret", data.secret);
        redirect.searchParams.append("showCreateMessage", "true");
        window.location.replace(redirect);
      }
    } catch (_: unknown) {
      setStore("showErrors", "general", true);
    } finally {
      setStore("state", "IDLE");
    }
  }

  return (
    <>
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
        <Button
          type="submit"
          kind={store.state === "IDLE" ? "success" : "gray"}
          label={
            store.state === "IDLE"
              ? "Anmeldung starten"
              : "Anmeldung wird gestartet"
          }
          disabled={store.state === "LOADING"}
        />
      </form>
      <br />
      <Show when={store.showErrors.general}>
        <Box type="danger">
          Es gab ein Problem, das wir nicht erwartet haben. Bitte versuche es
          erneut oder <a href="/kontakt">kontaktiere uns direkt</a>.
        </Box>
      </Show>
    </>
  );
}
