import type { JSX } from "solid-js";
import { Icon, type IconType } from "./Icon";

type Props = {
  type?: "submit" | "button" | "reset";
  kind?: "accent" | "special" | "gray" | "success" | "danger" | "ghost";
  disabled?: boolean;
  onClick?: ((e: Event) => void) | undefined;
};

export function Button(
  props: Props & { label: string | JSX.Element },
): JSX.Element {
  const classes = () => {
    const cls: string[] = [];
    if (props.kind !== undefined) {
      cls.push(`button-${props.kind}`);
    } else if (props.disabled) {
      cls.push("button-gray");
    } else {
      cls.push("button-accent");
    }
    if (props.onClick === undefined) {
      cls.push("button-no-event");
    }
    return cls;
  };

  return (
    <button
      type={props.type ?? "button"}
      class={classes().join(" ")}
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
  const classes = () => {
    const cls: string[] = [];
    if (props.kind !== undefined) {
      cls.push(`button-${props.kind}`);
    } else if (props.disabled) {
      cls.push("button-gray");
    } else {
      cls.push("button-accent");
    }
    if (props.onClick === undefined) {
      cls.push("button-no-event");
    }
    return cls;
  };

  return (
    <button
      type={props.type ?? "button"}
      class={classes().join(" ")}
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
  const classes = () => {
    const cls: string[] = ["button-icon"];
    if (props.kind !== undefined) {
      cls.push(`button-${props.kind}`);
    } else if (props.disabled) {
      cls.push("button-gray");
    } else {
      cls.push("button-accent");
    }
    if (props.onClick === undefined) {
      cls.push("button-no-event");
    }
    return cls;
  };

  return (
    <button
      type={props.type ?? "button"}
      class={classes().join(" ")}
      disabled={props.disabled === true}
      onClick={(e) => props.onClick?.(e)}
    >
      <Icon icon={props.icon} />
    </button>
  );
}
