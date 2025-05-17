import { mergeProps, type JSX } from "solid-js";

type Props = {
  value: string;
  onValueUpdate: (next: string) => void;
  label: string;
  name: string;
  required?: boolean;
  size?: "sm";
};

export function Textarea(props: Props): JSX.Element {
  const propsWithDefaults = mergeProps({ required: true }, props);

  return (
    <label>
      {propsWithDefaults.label}
      <textarea
        class={props.size === "sm" ? "small" : ""}
        name={propsWithDefaults.name}
        placeholder={propsWithDefaults.label}
        required={propsWithDefaults.required}
        value={propsWithDefaults.value}
        onInput={(e) => propsWithDefaults.onValueUpdate(e.target.value)}
      />
    </label>
  );
}
