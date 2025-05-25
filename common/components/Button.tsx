import type { JSX } from "solid-js";
import { Icon, type IconType } from "./Icon";

type Props = {
  type?: "submit" | "button" | "reset";
  kind?: "accent" | "special" | "gray" | "success" | "danger";
  disabled?: boolean;
  onClick?: (e: Event) => void;
};

export function Button(
  props: Props & { label: string | JSX.Element },
): JSX.Element {
  return (
    <button
      type={props.type ?? "button"}
      class={`button-${props.kind ?? (props.disabled ? "gray" : "accent")}`}
      disabled={props.disabled === true}
      onClick={(e) => props.onClick?.(e)}
    >
      {props.label}
    </button>
  );
}

export function ButtonWithIcon(
  props: Props & { label: string; icon: IconType },
): JSX.Element {
  return (
    <button
      type={props.type ?? "button"}
      class={`button-${props.kind ?? (props.disabled ? "gray" : "accent")}`}
      disabled={props.disabled === true}
      onClick={(e) => props.onClick?.(e)}
    >
      <span style="display: flex; gap: 0.5rem; align-items: center;">
        <Icon icon={props.icon} />
        {props.label}
      </span>
    </button>
  );
}

export function IconOnlyButton(props: Props & { icon: IconType }): JSX.Element {
  return (
    <button
      type={props.type ?? "button"}
      class={`button-${props.kind ?? (props.disabled ? "gray" : "accent")} button-icon`}
      disabled={props.disabled === true}
      onClick={(e) => props.onClick?.(e)}
    >
      <Icon icon={props.icon} />
    </button>
  );
}
