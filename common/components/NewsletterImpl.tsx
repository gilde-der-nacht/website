import { For, Show, createSignal, type JSX } from "solid-js";
import { Form } from "@common/components/Form";
import { Input, InputWithRef } from "@common/components/Input";
import { CheckboxGroup, type CheckboxGroupProps } from "@common/components/Checkbox";
import { RadioGroup, type RadioGroupProps } from "@common/components/Radio";
import { HiddenInput } from "@common/components/HiddenInput";
import { Box } from "@common/components/Box";

type Frequency = "oft" | "selten"

type Props = {
  theme: "Brettspiele" | "Rollenspiele" | "Tabletop" | undefined;
  frequenzy: Frequency | undefined;
  referer: URL | undefined;
}

type FormDataSchema = {
  firstName: string;
  lastName: string;
  email: string;
  themeBrettspiele: boolean;
  themeRollenspiele: boolean;
  themeTabletop: boolean;
  frequency: Frequency;
}

const actionUrl = new URL("https://gildedernacht.us9.list-manage.com/subscribe/post?u=ac8c826d7db864c54a3c2f001&amp;id=c6bec31754");

function resetFormData(props: Props): FormDataSchema {
  return {
    firstName: "", lastName: "", email: "", themeBrettspiele: props.theme === "Brettspiele", themeRollenspiele: props.theme === "Rollenspiele", themeTabletop: props.theme === "Tabletop", frequency: props.frequenzy ?? "selten",
  };
}
type FieldErrors = Record<keyof FormDataSchema, string[]>;
function resetFieldErrors(): FieldErrors {
  return { firstName: [], lastName: [], email: [], themeBrettspiele: [], themeRollenspiele: [], themeTabletop: [], frequency: [] }
}

export function NewsletterImpl(props: Props): JSX.Element {
  const [formData, setFormData] = createSignal<FormDataSchema>(resetFormData(props))
  const [isSuccess, setSuccess] = createSignal(false);
  const [isErrorGeneral, setErrorGeneral] = createSignal(false);

  function updateField<K extends (keyof FormDataSchema)>(fieldName: K): (newValue: FormDataSchema[K]) => void {
    return (newValue) => {
      setErrorGeneral(false);
      setFieldErrors(resetFieldErrors());
      setFormData(prev => ({ ...prev, [fieldName]: newValue }));
    }
  }

  const checkboxValues = {
    BRETTSPIELE: "128",
    ROLLENSPIELE: "256",
    TABLETOP: "512"
  } as const;
  const checkboxGroup = () => {
    return {
      items: [
        {
          label: "Brettspiele",
          name: "group[48105][128]",
          value: checkboxValues.BRETTSPIELE,
          checked: formData().themeBrettspiele
        },
        {
          label: "Rollenspiele",
          name: "group[48105][256]",
          value: checkboxValues.ROLLENSPIELE,
          checked: formData().themeRollenspiele
        },
        {
          label: "Tabletop",
          name: "group[48105][512]",
          value: checkboxValues.TABLETOP,
          checked: formData().themeTabletop
        },
      ],
      onValueUpdate: (value, checked) => {
        switch (value) {
          case checkboxValues.BRETTSPIELE:
            updateField("themeBrettspiele")(checked);
            break;
          case checkboxValues.ROLLENSPIELE:
            updateField("themeRollenspiele")(checked);
            break;
          case checkboxValues.TABLETOP:
            updateField("themeTabletop")(checked);
            break;
        }
      }
    } satisfies CheckboxGroupProps<typeof checkboxValues[keyof typeof checkboxValues]>;
  }

  const radioValues = {
    OFT: "1024",
    SELTEN: "2048"
  } as const;
  const radioGroup = () => {
    return {
      items: [
        {
          label: "maximal 2 E-Mails / Monat",
          value: radioValues.OFT,
          checked: formData().frequency === "oft"
        },
        {
          label: "maximal 8 E-Mails / Jahr",
          value: radioValues.SELTEN,
          checked: formData().frequency === "selten"
        }
      ],
      name: "group[48109]",
      onValueUpdate: (value) => {
        switch (value) {
          case radioValues.OFT:
            updateField("frequency")("oft")
            break;
          case radioValues.SELTEN:
            updateField("frequency")("selten")
            break;
        }
      }
    } satisfies RadioGroupProps<typeof radioValues[keyof typeof radioValues]>;
  };

  // Need to find better solution for this
  let emailInput!: HTMLInputElement;

  const [fieldErrors, setFieldErrors] = createSignal<FieldErrors>(resetFieldErrors())

  function isValid(_formData: FormData): boolean {
    setFieldErrors(resetFieldErrors());
    if (formData().firstName.trim().length === 0) {
      setFieldErrors((prev) => ({ ...prev, firstName: ["Dies ist ein Pflichtfeld."] }))
    }
    if (formData().lastName.trim().length === 0) {
      setFieldErrors((prev) => ({ ...prev, lastName: ["Dies ist ein Pflichtfeld."] }))
    }
    if (formData().email.trim().length === 0) {
      const msg = "Dies ist ein Pflichtfeld.";
      setFieldErrors((prev) => ({ ...prev, email: [...prev.email, msg] }));
    }
    if (emailInput.validity.typeMismatch) {
      const msg = "Die Eingabe scheint keine gültige E-Mail-Adresse zu sein.";
      setFieldErrors((prev) => ({ ...prev, email: [...prev.email, msg] }));
    }
    if (!(formData().themeBrettspiele || formData().themeRollenspiele || formData().themeTabletop)) {
      const msg = "Mindestens ein Thema muss ausgewählt werden, um E-Mails zu erhalten.";
      setFieldErrors((prev) => ({ ...prev, themeTabletop: [...prev.themeTabletop, msg] }));
    }
    return fieldErrors().firstName.length === 0 &&
      fieldErrors().lastName.length === 0 &&
      fieldErrors().email.length === 0 &&
      fieldErrors().themeBrettspiele.length === 0 &&
      fieldErrors().themeRollenspiele.length === 0 &&
      fieldErrors().themeTabletop.length === 0 &&
      fieldErrors().frequency.length === 0;
  }

  function onSuccess(): void {
    setSuccess(true);
    setFormData(resetFormData(props));
  }

  function onError(err: unknown): void {
    setErrorGeneral(true);
    console.error(err);
  }

  return (
    <>
      <Form
        actionUrl={actionUrl}
        submitLabel="Abonnieren"
        isValid={isValid}
        onSuccess={onSuccess}
        onError={onError}>
        <Input
          label="Vorname"
          name="FNAME"
          value={formData().firstName}
          onValueUpdate={updateField("firstName")} />
        <Show when={fieldErrors().firstName.length > 0}>
          <Box type="danger">
            <For each={fieldErrors().firstName}>{error => (
              <p>{error}</p>
            )}
            </For>
          </Box>
        </Show>
        <Input
          label="Nachname"
          name="LNAME"
          value={formData().lastName}
          onValueUpdate={updateField("lastName")} />
        <Show when={fieldErrors().lastName.length > 0}>
          <Box type="danger">
            <For each={fieldErrors().lastName}>{error => (
              <p>{error}</p>
            )}
            </For>
          </Box>
        </Show>
        <InputWithRef
          label="E-Mail-Adressse"
          type="email"
          name="EMAIL"
          value={formData().email}
          onValueUpdate={updateField("email")}
          ref={emailInput} />
        <Show when={fieldErrors().email.length > 0}>
          <Box type="danger">
            <For each={fieldErrors().email}>{error => (
              <p>{error}</p>
            )}
            </For>
          </Box>
        </Show>
        <h2>Thema</h2>
        <p>Wähle mindestens ein Thema aus, das dich interessiert.
          <br />Ansonsten wirst du keine E-Mails erhalten.</p>
        <CheckboxGroup
          items={checkboxGroup().items}
          onValueUpdate={checkboxGroup().onValueUpdate} />
        <Show when={fieldErrors().themeTabletop.length > 0}>
          <Box type="danger">
            <For each={fieldErrors().themeTabletop}>{error => (
              <p>{error}</p>
            )}
            </For>
          </Box>
        </Show>
        <h2>Häufigkeit</h2>
        <p>Wenn du dich für weniger häufigere E-Mails entscheidest <em>(maximal 8 E-Mails / Jahr)</em>,<br />werden wir dich hauptsächlich über grössere Events informieren.</p>
        <RadioGroup
          items={radioGroup().items}
          name={radioGroup().name}
          onValueUpdate={radioGroup().onValueUpdate}
        />
        <Show when={fieldErrors().frequency.length > 0}>
          <Box type="danger">
            <For each={fieldErrors().frequency}>{error => (
              <p>{error}</p>
            )}
            </For>
          </Box>
        </Show>
        <Show when={props.referer}>
          {referer => (<HiddenInput name="FORMLOC" value={referer().href} />)}
        </Show>
      </Form>
      <Show when={isErrorGeneral()}>
        <br />
        <Box type="danger">
          Wir hatten mit einigen technischen Problemen zu kämpfen. Bitte versuchen Sie es erneut.
        </Box>
      </Show>
      <Show when={isSuccess()}>
        <br />
        <Box type="success">
          Du hast dich erfolgreich in unseren Newsletter eingetragen.
        </Box>
      </Show>
    </>
  )
}
