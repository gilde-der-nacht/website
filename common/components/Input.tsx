import { mergeProps, type JSX } from "solid-js";

type Props = {
  label: string;
  name: string;
  type?: "text" | "date" | "email";
  required?: boolean;
  isHoneypot?: boolean;
}

export function Input(props: Props): JSX.Element {
  const propsWithDefaults = mergeProps({ type: "text", required: true, isHoneypot: false }, props);

  return (
    <label class={propsWithDefaults.isHoneypot ? "honey" : ""}>{propsWithDefaults.label}
      <input type={propsWithDefaults.type} name={propsWithDefaults.name} placeholder={propsWithDefaults.label} required={propsWithDefaults.required} />
    </label>
  )
}
