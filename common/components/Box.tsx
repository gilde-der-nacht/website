import { Show, type JSX } from "solid-js";
import type { WithChildren } from "@common/components/utils";
import { Icon, type IconType } from "@common/components/Icon";
import { IconOnlyButton } from "@common/components/Button";

export type BoxType = "success" | "danger" | "special" | "gray";

type Props = WithChildren & {
  type?: BoxType;
  link?: string;
  linkLabel?: string;
  onClick?: (() => void) | undefined;
  onClose?: (() => void) | undefined;
  icon?: IconType;
  iconRotating?: boolean;
};

export function Box(props: Props): JSX.Element {
  return (
    <div
      class={`box-${props.type ?? "gray"} ${props.onClose !== undefined ? "box-with-close" : ""}`}
      onClick={props.onClick}
    >
      <Show when={props.onClose}>
        {(cb) => (
          <IconOnlyButton onClick={cb()} icon="circle-xmark" kind="gray" />
        )}
      </Show>
      <Show when={props.icon}>
        {(icon) => (
          <Icon icon={icon()} rotating={props.iconRotating === true} />
        )}
      </Show>
      <span>{props.children}</span>
      <Show when={props.link !== undefined && props.linkLabel !== undefined}>
        <a
          href={props.link ?? ""}
          class={`button button-small button-${props.type ?? "gray"}`}
        >
          <Icon icon="arrow-turn-down-right" classes={["event-icon"]} />
          <span> {props.linkLabel}</span>
        </a>
      </Show>
    </div>
  );
}

export function SimpleBox(
  props: Omit<Props, "link" | "linkLabel">,
): JSX.Element {
  return (
    <div class={`box-${props.type ?? "gray"}`} style="display: block;">
      {props.children}
    </div>
  );
}
