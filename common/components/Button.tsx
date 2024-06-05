import type { JSX } from "solid-js";

type Props = {
  type?: "submit" | "button" | "reset";
  label: string;
  kind?: "accent" | "special" | "gray" | "success" | "danger";
  disabled?: boolean;
  onClick?: () => void;
};

export function Button(props: Props): JSX.Element {
  return (
    <button
      type={props.type ?? "button"}
      class={`button-${props.kind ?? (props.disabled ? "gray" : "accent")}`}
      disabled={props.disabled === true}
      onClick={() => props.onClick?.()}
    >
      {props.label}
    </button>
  );
}
