import { mergeProps, type JSX } from "solid-js";

type InputProps = {
  value: string;
  onValueUpdate: (value: string) => void;
  onBlur?: () => void;
  label: string;
  name: string;
  type?: "text" | "date" | "email" | "tel" | undefined;
  required?: boolean | undefined;
  isHoneypot?: boolean | undefined;
  disabled?: boolean | undefined;
};

export function Checkbox(props: InputProps): JSX.Element {
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
        onBlur={props.onBlur}
        disabled={props.disabled === true}
      />
    </label>
  );
}

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
        onInput={(e) => {
          propsWithDefaults.onValueUpdate(e.target.value);
        }}
        onBlur={props.onBlur}
        disabled={props.disabled === true}
      />
    </label>
  );
}

export function CheckboxInput(props: {
  value: boolean;
  onValueUpdate: (value: boolean) => void;
  onBlur?: () => void;
  label: JSX.Element;
  name: string;
  required?: boolean | undefined;
  isHoneypot?: boolean | undefined;
  disabled?: boolean | undefined;
}): JSX.Element {
  const propsWithDefaults = mergeProps(
    { type: "text", required: true, isHoneypot: false },
    props,
  );

  return (
    <label class={propsWithDefaults.isHoneypot ? "honey" : ""}>
      {propsWithDefaults.label}
      <input
        type="checkbox"
        name={propsWithDefaults.name}
        required={propsWithDefaults.required}
        checked={propsWithDefaults.value}
        onInput={(e) => {
          propsWithDefaults.onValueUpdate(e.target.checked);
        }}
        onBlur={props.onBlur}
        disabled={props.disabled === true}
      />
    </label>
  );
}

type InputWithRefProps = {
  value: string;
  onValueUpdate: (value: string) => void;
  onBlur?: () => void;
  label: string;
  name: string;
  type?: "text" | "date" | "email";
  required?: boolean;
  isHoneypot?: boolean;
  ref: HTMLInputElement;
  disabled?: boolean | undefined;
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
        onBlur={props.onBlur}
        ref={propsWithDefaults.ref}
        disabled={props.disabled === true}
      />
    </label>
  );
}

type InputIntegerProps = {
  value: number;
  onValueUpdate: (value: number) => void;
  onBlur?: () => void;
  label: string;
  name: string;
  required?: boolean | undefined;
  isHoneypot?: boolean | undefined;
  min?: number | undefined;
  max?: number | undefined;
  disabled?: boolean | undefined;
};

export function InputInteger(props: InputIntegerProps): JSX.Element {
  const propsWithDefaults = mergeProps(
    { required: true, isHoneypot: false },
    props,
  );

  return (
    <label class={propsWithDefaults.isHoneypot ? "honey" : ""}>
      {propsWithDefaults.label}
      <input
        type="number"
        name={propsWithDefaults.name}
        placeholder={propsWithDefaults.label}
        required={propsWithDefaults.required}
        value={propsWithDefaults.value}
        onInput={(e) =>
          propsWithDefaults.onValueUpdate(Number.parseInt(e.target.value))
        }
        onBlur={props.onBlur}
        step={1}
        min={propsWithDefaults.min}
        max={propsWithDefaults.max}
        disabled={props.disabled === true}
      />
    </label>
  );
}
