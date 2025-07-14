import { Box } from "@common/components/Box";
import { Button } from "@common/components/Button";
import { Checkbox } from "@common/components/Checkbox";
import { elysium } from "@common/components/utils";
import type { SaveClient } from "@rst/components/anmeldung/api/save";
import { TXT } from "@rst/components/anmeldung/constant/texts";
import { z } from "astro/zod";
import { Input, InputWithRef } from "common/components/Input.tsx";
import { type JSX, Show } from "solid-js";
import { createStore } from "solid-js/store";

export type PageState = {
  form: {
    name: string;
    email: string;
    tel: string;
    coc: boolean;
  };
  errors: {
    nameMissing: boolean;
    emailMissing: boolean;
    emailInvalid: boolean;
    cocMissing: boolean;
    general: boolean;
  };
  state: "IDLE" | "LOADING";
};

export function AnmeldungWrapper(): JSX.Element {
  const [store, setStore] = createStore<PageState>({
    form: {
      name: "",
      email: "",
      tel: "",
      coc: false,
    },
    errors: {
      nameMissing: false,
      emailMissing: false,
      emailInvalid: false,
      cocMissing: false,
      general: false,
    },
    state: "IDLE",
  });

  let emailField!: HTMLInputElement;

  async function onSubmit(e: SubmitEvent): Promise<void> {
    e.preventDefault();
    const nameIsMissing = store.form.name.trim().length === 0;
    setStore("errors", "nameMissing", nameIsMissing);

    const emailIsMissing = store.form.email.trim().length === 0;
    setStore("errors", "emailMissing", emailIsMissing);

    const emailIsInvalid = emailField.validity.typeMismatch;
    setStore("errors", "emailInvalid", emailIsInvalid);

    setStore("errors", "cocMissing", !store.form.coc);

    if (
      store.errors.nameMissing ||
      store.errors.emailMissing ||
      store.errors.emailInvalid ||
      store.errors.cocMissing
    ) {
      // Show errors, do not continue
      return;
    }

    setStore("state", "LOADING");

    try {
      const initialDataWithDefaults = {
        version: 1,
        init: {
          name: store.form.name,
          email: store.form.email,
          mobile: store.form.tel,
        },
        playing: {
          wantsUpdates: true,
          reservations: [],
        },
        master: {
          wantsHelp: false,
          games: [],
        },
        helping: {},
        lastSaved: new Date(),
      } satisfies Omit<SaveClient, "publishState">;
      const response = await fetch(elysium("/rst25/start"), {
        method: "post",
        body: JSON.stringify(initialDataWithDefaults),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        setStore("errors", "general", true);
      } else {
        const json = await response.json();
        const schema = z.object({
          secret: z.string(),
        });
        const data = schema.parse(json);
        const redirect = new URL(location.origin + "/meine-anmeldung");
        redirect.searchParams.append("secret", data.secret);
        redirect.searchParams.append("showCreateMessage", "true");
        window.location.replace(redirect);
      }
    } catch (_: unknown) {
      setStore("errors", "general", true);
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
            setStore("errors", "nameMissing", false);
          }}
        />
        <Show when={store.errors.nameMissing}>
          <Box type="danger">{TXT.mandatoryField}</Box>
        </Show>
        <InputWithRef
          label="E-Mail"
          name="email"
          type="email"
          value={store.form.email}
          onValueUpdate={(newValue) => {
            setStore("form", "email", newValue);
            setStore("errors", "emailMissing", false);
            setStore("errors", "emailInvalid", false);
          }}
          ref={emailField}
        />
        <Show when={store.errors.emailMissing}>
          <Box type="danger">{TXT.mandatoryField}</Box>
        </Show>
        <Show when={store.errors.emailInvalid}>
          <Box type="danger">{TXT.invalidEmail}</Box>
        </Show>
        <Input
          label="Handynummer"
          name="tel"
          type="tel"
          value={store.form.tel}
          required={false}
          onValueUpdate={(newValue) => setStore("form", "tel", newValue)}
        />
        <Checkbox
          label={
            <span>
              Ich bestätige, dass ich den{" "}
              <a href="/verhaltenskodex" target="_blank" rel="noopener">
                Verhaltenskodex
              </a>{" "}
              gelesen habe und mich an die Regeln halten werde.
            </span>
          }
          name="coc"
          value="coc"
          checked={store.form.coc}
          onValueUpdate={(newValue) => setStore("form", "coc", newValue)}
        />
        <Show when={store.errors.cocMissing}>
          <Box type="danger">
            Der Verhaltenskodex muss gelesen und akzeptiert werden.
          </Box>
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
      <br />
      <Show when={store.errors.general}>
        <Box type="danger">
          Es gab ein Problem, das wir nicht erwartet haben. Bitte versuche es
          erneut oder <a href="/kontakt">kontaktiere uns direkt</a>.
        </Box>
        <br />
      </Show>
    </>
  );
}
