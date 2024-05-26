import { For, Match, Show, Switch, createSignal, type JSX } from "solid-js";
import { Form } from "@common/components/Form";
import { Input } from "@common/components/Input";
import { Textarea } from "@common/components/Textarea";
import { HiddenInput } from "@common/components/HiddenInput";
import { Box } from "./Box";

type Props = {
  language: "de" | "en" | undefined;
  category: "gilde" | "spieltage" | "rollenspieltage" | "tabletoptage" | undefined;
  referer: URL | undefined;
  redirectOnSuccess: URL | undefined;
  redirectOnFailure: URL | undefined;
}

export function ContactFormImpl(props: Props): JSX.Element {
  const nameLabel = "Name";
  const emailLabel = props.language === "de" ? "E-Mail" : "Email";
  const captchaLabel = props.language === "de" ? "Bitte leer lassen" : "leave this field empty";
  const messageLabel = props.language === "de" ? "Nachricht" : "Message";

  type FormDataSchema = {
    name: string;
    email: string;
    captcha: string;
    message: string;
  }

  const [formData, setFormData] = createSignal<FormDataSchema>({
    name: "",
    email: "",
    captcha: "",
    message: "",
  })


  let nameInput!: HTMLInputElement;
  let emailInput!: HTMLInputElement;
  let captchaInput!: HTMLInputElement;
  let messageTextarea!: HTMLTextAreaElement;
  const [isSuccess, setSuccess] = createSignal(false);
  const [isErrorGeneral, setErrorGeneral] = createSignal(false);

  function onSuccess(): void {
    setSuccess(true);
  }

  function onError(err: unknown): void {
    setErrorGeneral(true);
    console.error(err);
  }

  type FieldErrors = Record<keyof FormDataSchema, string[]>;

  const [fieldErrors, setFieldErrors] = createSignal<FieldErrors>({
    name: [],
    email: [],
    captcha: [],
    message: []
  })

  function updateField<K extends (keyof FormDataSchema)>(fieldName: K): (newValue: FormDataSchema[K]) => void {
    return (newValue) => {
      setErrorGeneral(false);
      setFieldErrors({ name: [], email: [], captcha: [], message: [] });
      setFormData(prev => ({ ...prev, [fieldName]: newValue }));
    }
  }

  function isValid(_formData: FormData): boolean {
    setFieldErrors({ name: [], email: [], captcha: [], message: [] });
    const isEnglish = props.language === "en";
    if (formData().name.trim().length === 0) {
      const msg = isEnglish ? "This is a mandatory field." : "Dies ist ein Pflichtfeld.";
      setFieldErrors((prev) => ({ ...prev, name: [...prev.name, msg] }));
    }
    if (formData().email.trim().length === 0) {
      const msg = isEnglish ? "This is a mandatory field." : "Dies ist ein Pflichtfeld.";
      setFieldErrors((prev) => ({ ...prev, email: [...prev.email, msg] }));
    }
    if (emailInput.validity.typeMismatch) {
      const msg =
        isEnglish ? "The input does not seem to be a valid email address." : "Die Eingabe scheint keine gültige E-Mail-Adresse zu sein.";
      setFieldErrors((prev) => ({ ...prev, email: [...prev.email, msg] }));
    }
    if (formData().captcha.trim().length > 0) {
      const msg = isEnglish ? "This is field must be empty." : "Dies Feld muss leer bleiben.";
      setFieldErrors((prev) => ({ ...prev, captcha: [...prev.captcha, msg] }));
    }
    if (formData().message.trim().length === 0) {
      const msg = isEnglish ? "This is a mandatory field." : "Dies ist ein Pflichtfeld.";
      setFieldErrors((prev) => ({ ...prev, message: [...prev.message, msg] }));
    }
    return fieldErrors().name.length === 0
      && fieldErrors().email.length === 0
      && fieldErrors().captcha.length === 0
      && fieldErrors().message.length === 0;
  }

  return (
    <>
      <Form language={props.language ?? "de"} isValid={isValid} onSuccess={onSuccess} onError={onError}>
        <Input label={nameLabel} name="private-name" value={formData().name} onValueUpdate={updateField("name")} ref={nameInput} />
        <Show when={fieldErrors().name.length > 0}>
          <Box type="danger">
            <For each={fieldErrors().name}>{error => (
              <p>{error}</p>
            )}
            </For>
          </Box>
        </Show>
        <Input label={emailLabel} name="private-email" type="email" value={formData().email} onValueUpdate={updateField("email")} ref={emailInput} />
        <Show when={fieldErrors().email.length > 0}>
          <Box type="danger">
            <For each={fieldErrors().email}>{error => (
              <p>{error}</p>
            )}
            </For>
          </Box>
        </Show>
        <Input label={captchaLabel} name="private-captcha" type="email" required={false} isHoneypot={true} value={formData().captcha} onValueUpdate={updateField("captcha")} ref={captchaInput} />
        <Show when={fieldErrors().captcha.length > 0}>
          <Box type="danger">
            <For each={fieldErrors().captcha}>{error => (
              <p>{error}</p>
            )}
            </For>
          </Box>
        </Show>
        <Textarea label={messageLabel} name="private-message" value={formData().message} onValueUpdate={updateField("message")} ref={messageTextarea} />
        <Show when={fieldErrors().message.length > 0}>
          <Box type="danger">
            <For each={fieldErrors().message}>{error => (
              <p>{error}</p>
            )}
            </For>
          </Box>
        </Show>
        {/* TOOD: REMOVE*/}
        <HiddenInput name="mail-config" value="disable" />
        {/* TOOD: REMOVE*/}
        <HiddenInput name="post-config" value="disable" />
        <Show when={props.language}>
          {language => (<HiddenInput name="language" value={language()} />)}
        </Show>
        <Show when={props.category}>
          {category => (<HiddenInput name="category" value={category()} />)}
        </Show>
        <Show when={props.referer}>
          {referer => (<HiddenInput name="referer" value={referer().href} />)}
        </Show>
        <Show when={props.redirectOnSuccess}>
          {redirectOnSuccess => (<HiddenInput name="redirect-on-success" value={redirectOnSuccess().href} />)}
        </Show>
        <Show when={props.redirectOnFailure}>
          {redirectOnFailure => (<HiddenInput name="redirect-on-failure" value={redirectOnFailure().href} />)}
        </Show>
      </Form>
      <Show when={isErrorGeneral()}>
        <br />
        <Box type="danger">
          <Switch fallback={"Leider konnten wir die Nachricht nicht absenden. Bitte versuche es erneut."}>
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
  )
}
