import { type JSX } from "solid-js";
import { Form } from "@common/components/Form";
import { Input } from "@common/components/Input";
import { Textarea } from "@common/components/Textarea";
import { HiddenInput } from "@common/components/HiddenInput";

type Props = {
  language?: "de" | "en";
}

export function ContactForm(props: Props): JSX.Element {
  const nameLabel = "Name";
  const mailLabel = props.language === "de" ? "E-Mail" : "Email";
  const captchaLabel = props.language === "de" ? "Bitte leer lassen" : "leave this field empty";
  const messageLabel = props.language === "de" ? "Nachricht" : "Message";

  return (
    <Form language={props.language ?? "de"}>
      <Input label={nameLabel} name="private-name" />
      <Input label={mailLabel} name="private-email" type="email" />
      <Input label={captchaLabel} name="private-captcha" type="email" required={false} isHoneypot={true} />
      <Textarea label={messageLabel} name="private-message" />
      <HiddenInput name="language" value={props.language ?? "de"} />
      <HiddenInput name="identification" value="todo" />
    </Form>
  )
}
