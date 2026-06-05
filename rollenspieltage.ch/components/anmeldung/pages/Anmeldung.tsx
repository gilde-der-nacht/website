import { Button } from "@common/components/Button";
import { Show, type JSX } from "solid-js";
import { Box } from "@common/components/Box";
import { z } from "astro/zod";
import { elysium } from "@common/components/utils";
import { createReactive, obj } from "@common/utils/reactivity";
import { TextInputField } from "@common/components/newForm/Input";
import { Checkbox } from "@common/components/newForm/Checkbox";

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
  const store$ = createReactive<Store>({
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
    const nameIsMissing = store$.get().form.name.trim().length === 0;
    store$
      .pipe(obj.sub("showErrors"))
      .pipe(obj.sub("nameMissing"))
      .set(nameIsMissing);

    const emailIsMissing = store$.get().form.email.trim().length === 0;
    store$
      .pipe(obj.sub("showErrors"))
      .pipe(obj.sub("emailMissing"))
      .set(emailIsMissing);

    const kodexIsMissing = store$.get().form.kodex === false;
    store$
      .pipe(obj.sub("showErrors"))
      .pipe(obj.sub("kodexIsMissing"))
      .set(kodexIsMissing);

    const emailIsInvalid = emailField.validity.typeMismatch;
    store$
      .pipe(obj.sub("showErrors"))
      .pipe(obj.sub("emailInvalid"))
      .set(emailIsInvalid);

    if (
      store$.get().showErrors.nameMissing ||
      store$.get().showErrors.emailMissing ||
      store$.get().showErrors.emailInvalid ||
      store$.get().showErrors.kodexIsMissing
    ) {
      // Show errors, do not continue
      return;
    }

    store$.pipe(obj.sub("state")).set("LOADING");

    try {
      const data: StartData = {
        name: store$.get().form.name,
        email: store$.get().form.email,
        mobile: store$.get().form.mobile,
        kodex: store$.get().form.kodex,
      };
      const response = await fetch(elysium("/rst26/start"), {
        method: "post",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        store$.pipe(obj.sub("showErrors")).pipe(obj.sub("general")).set(true);
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

        store$
          .pipe(obj.sub("showErrors"))
          .pipe(obj.sub("emailDuplicate"))
          .set(data.kind === "FAILURE" && data.reason === "DUPLICATE_EMAIL");

        if (data.kind === "SUCCESS") {
          const redirect = new URL(location.origin + "/meine-anmeldung");
          redirect.searchParams.append("secret", data.data.secret);
          redirect.searchParams.append("showCreateMessage", "true");
          window.location.href = `${redirect.origin}${redirect.pathname}#/${redirect.search}`; // Add the `#/` before the search string, otherwise the Solid HashRouter has no access to the search params
        }
      }
    } catch (e: unknown) {
      console.error(e);
      store$.pipe(obj.sub("showErrors")).pipe(obj.sub("general")).set(true);
    } finally {
      store$.pipe(obj.sub("state")).set("IDLE");
    }
  }

  return (
    <>
      <form onSubmit={onSubmit} novalidate>
        <TextInputField
          label="Name"
          name="name"
          value$={store$.pipe(obj.sub("form")).pipe(obj.sub("name"))}
          afterUpdate={() =>
            store$
              .pipe(obj.sub("showErrors"))
              .pipe(obj.sub("nameMissing"))
              .set(false)
          }
        />
        <Show when={store$.get().showErrors.nameMissing}>
          <Box type="danger">Dies ist ein Pflichtfeld.</Box>
        </Show>
        <TextInputField
          label="E-Mail"
          name="email"
          type="email"
          value$={store$.pipe(obj.sub("form")).pipe(obj.sub("email"))}
          afterUpdate={() => {
            store$
              .pipe(obj.sub("showErrors"))
              .pipe(obj.sub("emailMissing"))
              .set(false);
            store$
              .pipe(obj.sub("showErrors"))
              .pipe(obj.sub("emailInvalid"))
              .set(false);
          }}
          ref={emailField}
        />
        <Show when={store$.get().showErrors.emailMissing}>
          <Box type="danger">Dies ist ein Pflichtfeld.</Box>
        </Show>
        <Show when={store$.get().showErrors.emailInvalid}>
          <Box type="danger">
            Die Eingabe scheint keine gültige E-Mail-Adresse zu sein.
          </Box>
        </Show>
        <Show when={store$.get().showErrors.emailDuplicate}>
          <Box type="danger">
            Diese E-Mail wird bereits verwendet. Du solltest einen persönlichen
            Link erhalten haben, um deine fortzusetzen. Benötigst du Hilfe, dann
            kontaktiere uns bitte über das{" "}
            <a href="/kontakt">Kontaktformular</a> oder unseren{" "}
            <a href="/chat">Chat</a>.
          </Box>
        </Show>
        <TextInputField
          label="Handynummer (optional)"
          name="mobile"
          type="tel"
          value$={store$.pipe(obj.sub("form")).pipe(obj.sub("mobile"))}
          required={false}
        />
        <Checkbox
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
          value="kodex"
          checked$={store$.pipe(obj.sub("form")).pipe(obj.sub("kodex"))}
          afterUpdate={() => {
            store$
              .pipe(obj.sub("showErrors"))
              .pipe(obj.sub("kodexIsMissing"))
              .set(false);
          }}
        />
        <Show when={store$.get().showErrors.kodexIsMissing}>
          <Box type="danger">Dies ist ein Pflichtfeld.</Box>
        </Show>
        <Button
          type="submit"
          kind={store$.get().state === "IDLE" ? "success" : "gray"}
          label={
            store$.get().state === "IDLE"
              ? "Anmeldung starten"
              : "Anmeldung wird gestartet"
          }
          disabled={store$.get().state === "LOADING"}
        />
      </form>
      <Show when={store$.get().showErrors.general}>
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
