import type { JSX } from "astro/jsx-runtime";

type Props = {
  type?: "submit" | "button" | "reset";
  label: string;
  kind?: "accent" | "special" | "gray" | "success" | "danger";
  disabled?: boolean;
};

export function Button(props: Props): JSX.Element {
  return (
    <button
      type={props.type ?? "button"}
      class={`button-${props.kind ?? "accent"}`}
      disabled={props.disabled ?? false}
    >
      {props.label}
    </button>
  );
}
