import { mergeProps, type JSX } from "solid-js";

type InputProps = {
  value: string;
  onValueUpdate: (value: string) => void;
  label: string;
  name: string;
  type?: "text" | "date" | "email" | "tel";
  required?: boolean;
  isHoneypot?: boolean;
};

export function Input(props: InputProps): JSX.Element {
  const propsWithDefaults = mergeProps(
    { type: "text", required: true, isHoneypot: false },
    props,
  );

  return (
    <label class={propsWithDefaults.isHoneypot ? "honey" : ""}>
      {propsWithDefaults.label}
      <input
        type={propsWithDefaults.type}
        name={propsWithDefaults.name}
        placeholder={propsWithDefaults.label}
        required={propsWithDefaults.required}
        value={propsWithDefaults.value}
        onInput={(e) => propsWithDefaults.onValueUpdate(e.target.value)}
      />
    </label>
  );
}

type InputWithRefProps = {
  value: string;
  onValueUpdate: (value: string) => void;
  label: string;
  name: string;
  type?: "text" | "date" | "email";
  required?: boolean;
  isHoneypot?: boolean;
  ref: HTMLInputElement;
};

export function InputWithRef(props: InputWithRefProps): JSX.Element {
  const propsWithDefaults = mergeProps(
    { type: "text", required: true, isHoneypot: false },
    props,
  );

  return (
    <label class={propsWithDefaults.isHoneypot ? "honey" : ""}>
      {propsWithDefaults.label}
      <input
        type={propsWithDefaults.type}
        name={propsWithDefaults.name}
        placeholder={propsWithDefaults.label}
        required={propsWithDefaults.required}
        value={propsWithDefaults.value}
        onInput={(e) => propsWithDefaults.onValueUpdate(e.target.value)}
        ref={propsWithDefaults.ref}
      />
    </label>
  );
}
