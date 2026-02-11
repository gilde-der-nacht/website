import type { Reactive } from "@common/utils/reactivity";
import { createSignal, For, Show, type JSX } from "solid-js";
import { Textarea } from "@common/components/Textarea";
import { Box } from "@common/components/Box";

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
        <Box type="danger">
          <For each={errors()}>{(error) => <p>{error}</p>}</For>
        </Box>
      </Show>
    </>
  );
}
