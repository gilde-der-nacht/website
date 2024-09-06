import type { Category, Language } from "@common/components/utils";
import { Input } from "@common/components/Input";
import { Form } from "@common/components/Form";
import { Textarea } from "@common/components/Textarea";
import { For, Match, Show, Switch, createSignal, type JSX } from "solid-js";
import { Box } from "@common/components/Box";
import { HiddenInput } from "@common/components/HiddenInput";

export type FormElement = {
  type: "text" | "textarea" | "tel" | "email" | "date";
  label: string;
  required?: boolean;
};

type Props<Fields extends string> = {
  elements: Record<Fields, FormElement>;
  language: Language | undefined;
  category: Category | undefined;
  referer: URL | undefined;
  redirectOnSuccess: URL | undefined;
  redirectOnFailure: URL | undefined;
  redirectOnSpam: URL | undefined;
};

const actionUrl = new URL("https://elysium.gildedernacht.ch/forms");

type FormDataSchema<Fields extends string> = Record<Fields, string>;

type FieldErrors<Fields extends string> = Record<Fields, string[]>;

function resetFieldErrors<Fields extends string>(
  elements: Record<Fields, FormElement>,
): FieldErrors<Fields> {
  const keys = Object.keys(elements) as Fields[];
  const pairs = keys.map<[Fields, string[]]>((key) => [key, []]);
  return Object.fromEntries(pairs) as Record<Fields, string[]>;
}

function resetFormData<Fields extends string>(
  elements: Record<Fields, FormElement>,
): FormDataSchema<Fields> {
  const keys = Object.keys(elements) as Fields[];
  const pairs = keys.map<[Fields, string]>((key) => [key, ""]);
  return Object.fromEntries(pairs) as Record<Fields, string>;
}

export function GenericFormImpl<Fields extends string>(
  props: Props<Fields>,
): JSX.Element {
  const keys = Object.keys(props.elements) as Fields[];
  const [formData, setFormData] = createSignal<Record<Fields, string>>(
    resetFormData(props.elements),
  );

  const [isSuccess, setSuccess] = createSignal(false);
  const [isErrorGeneral, setErrorGeneral] = createSignal(false);

  function onSuccess(): void {
    setErrorGeneral(false);
    setFormData(() => resetFormData(props.elements));
    setSuccess(true);
  }

  function onError(err: unknown): void {
    setSuccess(false);
    setErrorGeneral(true);
    console.error(err);
  }

  const [fieldErrors, setFieldErrors] = createSignal(
    resetFieldErrors(props.elements),
  );

  function updateField<Fields extends string>(
    fieldName: Fields,
  ): (newValue: string) => void {
    return (newValue) => {
      setErrorGeneral(false);
      setFieldErrors(() => resetFieldErrors(props.elements));
      setFormData((prev) => ({ ...prev, [fieldName]: newValue }));
    };
  }

  function isValid(_formData: FormData): boolean {
    setFieldErrors(() => resetFieldErrors(props.elements));
    const isEnglish = props.language === "en";
    (Object.entries(formData()) as [Fields, string][]).forEach(
      ([field, value]) => {
        if (
          props.elements[field].required === true &&
          value.trim().length === 0
        ) {
          const msg = isEnglish
            ? "This is a mandatory field."
            : "Dies ist ein Pflichtfeld.";
          setFieldErrors((prev) => ({
            ...prev,
            [field]: [...prev[field], msg],
          }));
        }
      },
    );
    return (Object.values(fieldErrors()) as string[][]).flat().length === 0;
  }

  return (
    <>
      <Form
        actionUrl={actionUrl}
        isValid={isValid}
        onSuccess={onSuccess}
        onError={onError}
      >
        <For each={keys}>
          {(key) => {
            const element = props.elements[key];
            return (
              <>
                <Switch>
                  <Match
                    when={
                      element.type === "text" ||
                      element.type === "tel" ||
                      element.type === "date" ||
                      element.type === "email"
                    }
                  >
                    <Input
                      type={element.type as "text" | "tel" | "date" | "email"}
                      label={element.label}
                      name={`private-${key}`}
                      required={element.required ?? false}
                      value={formData()[key]}
                      onValueUpdate={updateField(key)}
                    />
                  </Match>
                  <Match when={element.type === "textarea"}>
                    <Textarea
                      label={element.label}
                      name={`private-${key}`}
                      value={formData()[key]}
                      required={element.required ?? false}
                      onValueUpdate={updateField(key)}
                    />
                  </Match>
                </Switch>
                <Show when={fieldErrors()[key].length > 0}>
                  <Box type="danger">
                    <For each={fieldErrors()[key]}>
                      {(error) => <p>{error}</p>}
                    </For>
                  </Box>
                </Show>
              </>
            );
          }}
        </For>
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
