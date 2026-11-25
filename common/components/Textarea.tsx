import { merge } from "solid-js";
import type { JSX } from "@solidjs/web";

type Props = {
  value: string;
  onValueUpdate: (next: string) => void;
  onBlur?: () => void;
  label: string;
  name: string;
  required?: boolean | undefined;
  size?: "small" | undefined;
  disabled?: boolean | undefined;
};

export function Textarea(props: Props): JSX.Element {
  const propsWithDefaults = merge({ required: true }, props);

  return (
    <label>
      {propsWithDefaults.label}
      <textarea
        class={props.size === "small" ? "small" : ""}
        name={propsWithDefaults.name}
        placeholder={propsWithDefaults.label}
        required={propsWithDefaults.required}
        value={propsWithDefaults.value}
        onInput={(e) => propsWithDefaults.onValueUpdate(e.target.value)}
        onBlur={props.onBlur}
        disabled={props.disabled === true}
      />
    </label>
  );
}
