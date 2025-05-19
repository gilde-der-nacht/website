import type { JSX } from "solid-js";
import { Icon, type IconType } from "./Icon";

type Props = {
  type?: "submit" | "button" | "reset";
  kind?: "accent" | "special" | "gray" | "success" | "danger";
  disabled?: boolean;
  onClick?: () => void;
};

export function Button(
  props: Props & { label: string | JSX.Element },
): JSX.Element {
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

export function IconButton(props: Props & { icon: IconType }): JSX.Element {
  return (
    <button
      type={props.type ?? "button"}
      class={`button-${props.kind ?? (props.disabled ? "gray" : "accent")} button-icon`}
      disabled={props.disabled === true}
      onClick={() => props.onClick?.()}
    >
      <Icon icon={props.icon} />
    </button>
  );
}
