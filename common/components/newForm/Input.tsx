import { Input, InputInteger } from "@common/components/Input";
import { createSignal, For, Show, type JSX } from "solid-js";
import { Box } from "@common/components/Box";
import type { Reactive } from "@common/utils/reactivity";

export function TextInputField(props: {
  value$: Reactive<string>;
  label: string;
  name: string;
  type?: "text" | "date" | "email" | "tel" | undefined;
  required?: boolean | undefined;
  showErrors?: "ALWAYS" | "ON_BLUR";
  errors?: string[];
  disabled?: boolean;
  afterUpdate?: () => void;
  ref?: HTMLInputElement;
}): JSX.Element {
  const [isDirty, setDirty] = createSignal(false);
  const alwaysShowErrors = props.showErrors === "ALWAYS";
  const errors = () =>
    alwaysShowErrors || isDirty() ? (props.errors ?? []) : [];
  return (
    <>
      <Input
        label={props.label}
        name={props.name}
        value={props.value$.get()}
        onValueUpdate={(newValue) => {
          props.value$.set(newValue);
          props.afterUpdate?.();
        }}
        onBlur={() => setDirty(true)}
        type={props.type}
        required={props.required}
        disabled={props.disabled}
        ref={props.ref}
      />
      <Show when={errors().length > 0}>
        <Box type="danger">
          <For each={errors()}>{(error) => <p>{error}</p>}</For>
        </Box>
      </Show>
    </>
  );
}

export function NumberInputField(props: {
  value$: Reactive<number>;
  label: string;
  name: string;
  required?: boolean | undefined;
  min?: number | undefined;
  max?: number | undefined;
  showErrors?: "ALWAYS" | "ON_BLUR";
  errors?: string[];
  disabled?: boolean;
}): JSX.Element {
  const [isDirty, setDirty] = createSignal(false);
  const alwaysShowErrors = props.showErrors === "ALWAYS";
  const errors = () =>
    alwaysShowErrors || isDirty() ? (props.errors ?? []) : [];

  return (
    <>
      <InputInteger
        label={props.label}
        name={props.name}
        value={props.value$.get()}
        onValueUpdate={(newValue) => props.value$.set(newValue)}
        onBlur={() => setDirty(true)}
        required={props.required}
        min={props.min}
        max={props.max}
        disabled={props.disabled}
      />
      <Show when={errors().length > 0}>
        <Box type="danger">
          <For each={errors()}>{(error) => <p>{error}</p>}</For>
        </Box>
      </Show>
    </>
  );
}
