import type { Reactive } from "@common/utils/reactivity";
import { createSignal, For, Show, type JSX } from "solid-js";
import { Box } from "@common/components/Box";
import { SwitchCheckbox as SC } from "@common/components/Checkbox";

export function SwitchCheckbox<L extends string, R extends string>(props: {
  value$: Reactive<L | R>;
  options: {
    left: {
      value: L;
      label: string;
    };
    right: {
      value: R;
      label: string;
    };
  };
  name: string;
  required?: boolean | undefined;
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
      <SC
        labels={{
          left: props.options.left.label,
          right: props.options.right.label,
        }}
        name={props.name}
        checked={props.value$.get() === props.options.right.value}
        onChange={(value) =>
          props.value$.set(
            value ? props.options.right.value : props.options.left.value,
          )
        }
        onBlur={() => setDirty(true)}
        value={props.name}
        disabled={props.disabled === true}
      />
      <Show when={errors().length > 0}>
        <Box type="danger">
          <For each={errors()}>{(error) => <p>{error}</p>}</For>
        </Box>
      </Show>
    </>
  );
}
