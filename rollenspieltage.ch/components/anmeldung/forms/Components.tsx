import { Input, InputInteger } from "@common/components/Input";
import { For, Show, type JSX } from "solid-js";
import { createStore, type Store } from "solid-js/store";
import type {
  TextInput,
  NumberInput,
} from "@rst/components/anmeldung/api/form";
import { Box } from "@common/components/Box";
import { Textarea } from "@common/components/Textarea";

export function TextInputField(props: {
  store: Store<TextInput>;
  label: string;
  name: string;
  type?: "text" | "date" | "email" | "tel" | undefined;
  required?: boolean | undefined;
  isHoneypot?: boolean | undefined;
  showErrors?: "ALWAYS" | "ON_BLUR";
  errors?: string[];
}): JSX.Element {
  const [store, setStore] = createStore(props.store);
  const alwaysShowErrors = props.showErrors === "ALWAYS";
  const errors = () =>
    alwaysShowErrors || store.isDirty ? (props.errors ?? []) : [];
  return (
    <>
      <Input
        label={props.label}
        name={props.name}
        value={store.value}
        onValueUpdate={(newValue) => setStore("value", newValue)}
        onBlur={() => setStore("isDirty", true)}
        type={props.type}
        required={props.required}
        isHoneypot={props.isHoneypot}
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
  store: Store<NumberInput>;
  label: string;
  name: string;
  required?: boolean | undefined;
  isHoneypot?: boolean | undefined;
  min?: number | undefined;
  max?: number | undefined;
  showErrors?: "ALWAYS" | "ON_BLUR";
  errors?: string[];
}): JSX.Element {
  const [store, setStore] = createStore(props.store);
  const alwaysShowErrors = props.showErrors === "ALWAYS";
  const errors = () =>
    alwaysShowErrors || store.isDirty ? (props.errors ?? []) : [];
  return (
    <>
      <InputInteger
        label={props.label}
        name={props.name}
        value={store.value}
        onValueUpdate={(newValue) => setStore("value", newValue)}
        onBlur={() => setStore("isDirty", true)}
        required={props.required}
        isHoneypot={props.isHoneypot}
        min={props.min}
        max={props.max}
      />
      <Show when={errors().length > 0}>
        <Box type="danger">
          <For each={errors()}>{(error) => <p>{error}</p>}</For>
        </Box>
      </Show>
    </>
  );
}

export function TextareaField(props: {
  store: Store<TextInput>;
  label: string;
  name: string;
  required?: boolean | undefined;
  size?: "small" | undefined;
  showErrors?: "ALWAYS" | "ON_BLUR";
  errors?: string[];
}): JSX.Element {
  const [store, setStore] = createStore(props.store);
  const alwaysShowErrors = props.showErrors === "ALWAYS";
  const errors = () =>
    alwaysShowErrors || store.isDirty ? (props.errors ?? []) : [];
  return (
    <>
      <Textarea
        label={props.label}
        name={props.name}
        value={store.value}
        onValueUpdate={(newValue) => setStore("value", newValue)}
        onBlur={() => setStore("isDirty", true)}
        required={props.required}
        size={props.size}
      />
      <Show when={errors().length > 0}>
        <Box type="danger">
          <For each={errors()}>{(error) => <p>{error}</p>}</For>
        </Box>
      </Show>
    </>
  );
}
