import type { Reactive } from "@common/utils/reactivity";
import { createSignal, For, Show, type JSX } from "solid-js";
import { Textarea } from "@common/components/Textarea";

export function TextareaField(props: {
  value$: Reactive<string>;
  label: string;
  name: string;
  required?: boolean | undefined;
  size?: "small" | undefined;
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
      <Textarea
        label={props.label}
        name={props.name}
        value={props.value$.get()}
        onValueUpdate={(newValue) => props.value$.set(newValue)}
        onBlur={() => setDirty(true)}
        required={props.required}
        size={props.size}
        disabled={props.disabled}
      />
      <Show when={errors().length > 0}>
        <div style="color: var(--clr-danger-11); font-weight: bold; background-color: white;">
          <For each={errors()}>{(error) => <p>{error}</p>}</For>
        </div>
      </Show>
    </>
  );
}
