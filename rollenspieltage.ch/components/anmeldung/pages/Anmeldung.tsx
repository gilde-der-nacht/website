import {
  Input,
  InputWithRef,
  CheckboxInput,
} from "common/components/Input.tsx";
import { createStore } from "solid-js/store";
import { Button } from "@common/components/Button";
import { Show, type JSX } from "solid-js";
import { Box } from "@common/components/Box";
import { z } from "astro/zod";
import { elysium } from "@common/components/utils";

type Store = {
  form: { name: string; email: string; mobile: string; kodex: boolean };
  showErrors: {
    nameMissing: boolean;
    emailMissing: boolean;
    emailInvalid: boolean;
    emailDuplicate: boolean;
    kodexIsMissing: boolean;
    general: boolean;
  };
  state: "IDLE" | "LOADING";
};

type StartData = {
  name: string;
  email: string;
  mobile: string;
  kodex: boolean;
};

export function Anmeldung(): JSX.Element {
  const [store, setStore] = createStore<Store>({
    form: {
      name: "",
      email: "",
      mobile: "",
      kodex: false,
    },
    showErrors: {
      nameMissing: false,
      emailMissing: false,
      emailInvalid: false,
      emailDuplicate: false,
      kodexIsMissing: false,
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

    const kodexIsMissing = store.form.kodex === false;
    setStore("showErrors", "kodexIsMissing", kodexIsMissing);

    const emailIsInvalid = emailField.validity.typeMismatch;
    setStore("showErrors", "emailInvalid", emailIsInvalid);

    if (
      store.showErrors.nameMissing ||
      store.showErrors.emailMissing ||
      store.showErrors.emailInvalid ||
      store.showErrors.kodexIsMissing
    ) {
      // Show errors, do not continue
      return;
    }

    setStore("state", "LOADING");

    try {
      const data: StartData = {
        name: store.form.name,
        email: store.form.email,
        mobile: store.form.mobile,
        kodex: store.form.kodex,
      };
      const response = await fetch(elysium("/rst26/start"), {
        method: "post",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        setStore("showErrors", "general", true);
      } else {
        const json = await response.json();
        const schema = z.union([
          z.object({
            kind: z.literal("SUCCESS"),
            data: z.object({
              secret: z.string(),
            }),
          }),
          z.object({
            kind: z.literal("FAILURE"),
            reason: z.literal("DUPLICATE_EMAIL"),
          }),
        ]);
        const data = schema.parse(json);

        setStore(
          "showErrors",
          "emailDuplicate",
          data.kind === "FAILURE" && data.reason === "DUPLICATE_EMAIL",
        );

        if (data.kind === "SUCCESS") {
          const redirect = new URL(location.origin + "/meine-anmeldung");
          redirect.searchParams.append("secret", data.data.secret);
          redirect.searchParams.append("showCreateMessage", "true");
          window.location.href = `${redirect.origin}${redirect.pathname}#/${redirect.search}`; // Add the `#/` before the search string, otherwise the Solid HashRouter has no access to the search params
        }
      }
    } catch (e: unknown) {
      console.error(e);
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
        <Show when={store.showErrors.emailDuplicate}>
          <Box type="danger">
            Diese E-Mail wird bereits verwendet. Du solltest einen persönlichen
            Link erhalten haben, um deine fortzusetzen. Benötigst du Hilfe, dann
            kontaktiere uns bitte über das{" "}
            <a href="/kontakt">Kontaktformular</a> oder unseren{" "}
            <a href="/chat">Chat</a>.
          </Box>
        </Show>
        <Input
          label="Handynummer (optional)"
          name="mobile"
          type="tel"
          value={store.form.mobile}
          required={false}
          onValueUpdate={(newValue) => setStore("form", "mobile", newValue)}
        />
        <CheckboxInput
          label={
            <>
              Ich habe den{" "}
              <a href="/verhaltenskodex" target="_blank">
                Verhaltenskodex
              </a>{" "}
              gelesen und bin damit einverstanden
            </>
          }
          name="kodex"
          value={store.form.kodex}
          required={true}
          onValueUpdate={(newValue) => {
            setStore("form", "kodex", newValue);
            setStore("showErrors", "kodexIsMissing", false);
          }}
        />
        <Show when={store.showErrors.kodexIsMissing}>
          <Box type="danger">Dies ist ein Pflichtfeld.</Box>
        </Show>
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
      <Show when={store.showErrors.general}>
        <div style="margin-block-start: 1rem;">
          <Box type="danger">
            Es gab ein Problem, das wir nicht erwartet haben. Bitte versuche es
            erneut oder <a href="/kontakt">kontaktiere uns direkt</a>.
          </Box>
        </div>
      </Show>
    </>
  );
}
