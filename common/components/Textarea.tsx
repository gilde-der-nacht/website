import { mergeProps, type JSX } from "solid-js";

type Props = {
  label: string;
  name: string;
  required?: boolean;
}

export function Textarea(props: Props): JSX.Element {
  const propsWithDefaults = mergeProps({ required: true }, props);

  return (
    <label >{propsWithDefaults.label}
      <textarea name={propsWithDefaults.name} placeholder={propsWithDefaults.label} required={propsWithDefaults.required} />
    </label>
  )
}
