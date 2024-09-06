import { For, Match, Show, Switch, createSignal, type JSX } from "solid-js";
import { Form } from "@common/components/Form";
import { Input, InputWithRef } from "@common/components/Input";
import { Textarea } from "@common/components/Textarea";
import { HiddenInput } from "@common/components/HiddenInput";
import { Box } from "@common/components/Box";
import type { Language } from "@common/components/utils";

/*
 * This is a hot mess. Should work for now, but should be cleaned up.
 */

type Props = {
  language: Language | undefined;
  category:
    | "gilde"
    | "spieltage"
    | "rollenspieltage"
    | "tabletoptage"
    | undefined;
  referer: URL | undefined;
  redirectOnSuccess: URL | undefined;
  redirectOnFailure: URL | undefined;
  redirectOnSpam: URL | undefined;
};

type FormDataSchema = {
  name: string;
  email: string;
  captcha: string;
  message: string;
};

function resetFormData(): FormDataSchema {
  return { name: "", email: "", captcha: "", message: "" };
}

type FieldErrors = Record<keyof FormDataSchema, string[]>;
function resetFieldErrors(): FieldErrors {
  return { name: [], email: [], captcha: [], message: [] };
}

const actionUrl = new URL("https://elysium.gildedernacht.ch/forms");

export function ContactFormImpl(props: Props): JSX.Element {
  const nameLabel = "Name";
  const emailLabel = props.language !== "en" ? "E-Mail" : "Email";
  const captchaLabel =
    props.language !== "en" ? "Bitte leer lassen" : "leave this field empty";
  const messageLabel = props.language !== "en" ? "Nachricht" : "Message";

  const [formData, setFormData] = createSignal(resetFormData());

  // Need to find better solution for this
  let emailInput!: HTMLInputElement;
  const [isSuccess, setSuccess] = createSignal(false);
  const [isErrorGeneral, setErrorGeneral] = createSignal(false);

  function onSuccess(): void {
    setErrorGeneral(false);
    setFormData(resetFormData());
    setSuccess(true);
  }

  function onError(err: unknown): void {
    setSuccess(false);
    setErrorGeneral(true);
    console.error(err);
  }

  const [fieldErrors, setFieldErrors] = createSignal(resetFieldErrors());

  function updateField<K extends keyof FormDataSchema>(
    fieldName: K,
  ): (newValue: FormDataSchema[K]) => void {
    return (newValue) => {
      setErrorGeneral(false);
      setFieldErrors(resetFieldErrors());
      setFormData((prev) => ({ ...prev, [fieldName]: newValue }));
    };
  }

  function isValid(_formData: FormData): boolean {
    setFieldErrors(resetFieldErrors());
    const isEnglish = props.language === "en";
    if (formData().name.trim().length === 0) {
      const msg = isEnglish
        ? "This is a mandatory field."
        : "Dies ist ein Pflichtfeld.";
      setFieldErrors((prev) => ({ ...prev, name: [...prev.name, msg] }));
    }
    if (formData().email.trim().length === 0) {
      const msg = isEnglish
        ? "This is a mandatory field."
        : "Dies ist ein Pflichtfeld.";
      setFieldErrors((prev) => ({ ...prev, email: [...prev.email, msg] }));
    }
    if (emailInput.validity.typeMismatch) {
      const msg = isEnglish
        ? "The input does not seem to be a valid email address."
        : "Die Eingabe scheint keine gültige E-Mail-Adresse zu sein.";
      setFieldErrors((prev) => ({ ...prev, email: [...prev.email, msg] }));
    }
    if (formData().captcha.trim().length > 0) {
      const msg = isEnglish
        ? "This is field must be empty."
        : "Dieses Feld muss leer bleiben.";
      setFieldErrors((prev) => ({ ...prev, captcha: [...prev.captcha, msg] }));
    }
    if (formData().message.trim().length === 0) {
      const msg = isEnglish
        ? "This is a mandatory field."
        : "Dies ist ein Pflichtfeld.";
      setFieldErrors((prev) => ({ ...prev, message: [...prev.message, msg] }));
    }
    return (
      fieldErrors().name.length === 0 &&
      fieldErrors().email.length === 0 &&
      fieldErrors().captcha.length === 0 &&
      fieldErrors().message.length === 0
    );
  }

  return (
    <>
      <Form
        actionUrl={actionUrl}
        language={props.language ?? "de"}
        isValid={isValid}
        onSuccess={onSuccess}
        onError={onError}
      >
        <Input
          label={nameLabel}
          name="private-name"
          value={formData().name}
          onValueUpdate={updateField("name")}
        />
        <Show when={fieldErrors().name.length > 0}>
          <Box type="danger">
            <For each={fieldErrors().name}>{(error) => <p>{error}</p>}</For>
          </Box>
        </Show>
        <InputWithRef
          label={emailLabel}
          name="private-email"
          type="email"
          value={formData().email}
          onValueUpdate={updateField("email")}
          ref={emailInput}
        />
        <Show when={fieldErrors().email.length > 0}>
          <Box type="danger">
            <For each={fieldErrors().email}>{(error) => <p>{error}</p>}</For>
          </Box>
        </Show>
        <Input
          label={captchaLabel}
          name="private-captcha"
          type="email"
          required={false}
          isHoneypot={true}
          value={formData().captcha}
          onValueUpdate={updateField("captcha")}
        />
        <Show when={fieldErrors().captcha.length > 0}>
          <Box type="danger">
            <For each={fieldErrors().captcha}>{(error) => <p>{error}</p>}</For>
          </Box>
        </Show>
        <Textarea
          label={messageLabel}
          name="private-message"
          value={formData().message}
          onValueUpdate={updateField("message")}
        />
        <Show when={fieldErrors().message.length > 0}>
          <Box type="danger">
            <For each={fieldErrors().message}>{(error) => <p>{error}</p>}</For>
          </Box>
        </Show>
        <Show when={props.language}>
          {(language) => <HiddenInput name="language" value={language()} />}
        </Show>
        <Show when={props.category}>
          {(category) => <HiddenInput name="category" value={category()} />}
        </Show>
        <Show when={props.referer}>
          {(referer) => <HiddenInput name="referer" value={referer().href} />}
        </Show>
        <Show when={props.redirectOnSuccess}>
          {(redirectOnSuccess) => (
            <HiddenInput
              name="redirect-on-success"
              value={redirectOnSuccess().href}
            />
          )}
        </Show>
        <Show when={props.redirectOnFailure}>
          {(redirectOnFailure) => (
            <HiddenInput
              name="redirect-on-failure"
              value={redirectOnFailure().href}
            />
          )}
        </Show>
        <Show when={props.redirectOnSpam}>
          {(redirectOnSpam) => (
            <HiddenInput
              name="redirect-on-spam"
              value={redirectOnSpam().href}
            />
          )}
        </Show>
      </Form>
      <Show when={isErrorGeneral()}>
        <br />
        <Box type="danger">
          <Switch
            fallback={
              "Leider konnten wir die Nachricht nicht absenden. Bitte versuche es erneut."
            }
          >
            <Match when={props.language === "en"}>
              There was a problem sending your message. Please try again.
            </Match>
          </Switch>
        </Box>
      </Show>
      <Show when={isSuccess()}>
        <br />
        <Box type="success">
          <Switch fallback={"Nachricht wurde erfolgreich gesendet."}>
            <Match when={props.language === "en"}>
              Message successfully sent.
            </Match>
          </Switch>
        </Box>
      </Show>
    </>
  );
}
