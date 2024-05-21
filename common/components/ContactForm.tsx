import { For, Match, Show, Switch, createSignal, type JSX } from "solid-js";
import { Form } from "@common/components/Form";
import { Input } from "@common/components/Input";
import { Textarea } from "@common/components/Textarea";
import { HiddenInput } from "@common/components/HiddenInput";
import { Box } from "./Box";

type Props = {
  language?: "de" | "en";
}

export function ContactForm(props: Props): JSX.Element {
  const nameLabel = "Name";
  const emailLabel = props.language === "de" ? "E-Mail" : "Email";
  const captchaLabel = props.language === "de" ? "Bitte leer lassen" : "leave this field empty";
  const messageLabel = props.language === "de" ? "Nachricht" : "Message";

  const [formData, setFormData] = createSignal({
    name: "",
    email: "",
    captcha: "",
    message: "",
  })
  function updateName(next: string): void {
    setFormData(prev => ({ ...prev, name: next }));
  }
  function updateEmail(next: string): void {
    setFormData(prev => ({ ...prev, email: next }));
  }
  function updateCaptcha(next: string): void {
    setFormData(prev => ({ ...prev, captcha: next }));
  }
  function updateMessage(next: string): void {
    setFormData(prev => ({ ...prev, message: next }));
  }

  let nameInput!: HTMLInputElement;
  let emailInput!: HTMLInputElement;
  let captchaInput!: HTMLInputElement;
  let messageTextarea!: HTMLTextAreaElement;
  const [isErrorGeneral, setErrorGeneral] = createSignal(false);
  function onError(e: unknown): void {
    setErrorGeneral(true);
    console.error(e);
  }
  type FieldErrors = {
    name: string[];
    email: string[];
    captcha: string[];
    message: string[];
  }
  const [fieldErrors, setFieldErrors] = createSignal<FieldErrors>({
    name: [],
    email: [],
    captcha: [],
    message: []
  })
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
    console.log(fieldErrors());
    return fieldErrors().name.length === 0
      && fieldErrors().email.length === 0
      && fieldErrors().captcha.length === 0
      && fieldErrors().message.length === 0;
  }

  return (
    <>
      <Form language={props.language ?? "de"} isValid={isValid} onError={onError}>
        <Input label={nameLabel} name="private-name" value={formData().name} onValueUpdate={updateName} ref={nameInput} />
        <Show when={fieldErrors().name.length > 0}>
          <Box type="danger">
            <For each={fieldErrors().name}>{error => (
              <p>{error}</p>
            )}
            </For>
          </Box>
        </Show>
        <Input label={emailLabel} name="private-email" type="email" value={formData().email} onValueUpdate={updateEmail} ref={emailInput} />
        <Show when={fieldErrors().email.length > 0}>
          <Box type="danger">
            <For each={fieldErrors().email}>{error => (
              <p>{error}</p>
            )}
            </For>
          </Box>
        </Show>
        <Input label={captchaLabel} name="private-captcha" type="email" required={false} isHoneypot={true} value={formData().captcha} onValueUpdate={updateCaptcha} ref={captchaInput} />
        <Show when={fieldErrors().captcha.length > 0}>
          <Box type="danger">
            <For each={fieldErrors().captcha}>{error => (
              <p>{error}</p>
            )}
            </For>
          </Box>
        </Show>
        <Textarea label={messageLabel} name="private-message" value={formData().message} onValueUpdate={updateMessage} ref={messageTextarea} />
        <Show when={fieldErrors().message.length > 0}>
          <Box type="danger">
            <For each={fieldErrors().message}>{error => (
              <p>{error}</p>
            )}
            </For>
          </Box>
        </Show>
        <HiddenInput name="language" value={props.language ?? "de"} />
        <HiddenInput name="identification" value="todo" />
      </Form>
      <Show when={isErrorGeneral()}>
        <br />
        <Box type="danger">
          <Switch fallback={"Unfortunately a technical error has occurred. Please try again."}>
            <Match when={props.language === "de"}>
              Leider ist ein technischer Fehler passiert. Versuche es bitte nochmals.
            </Match>
          </Switch>
        </Box>
      </Show>
    </>
  )
}
