import { IconOnlyButton } from "@common/components/Button";
import { Icon } from "@common/components/Icon";
import type { WithChildren } from "@common/components/utils";
import { type JSX, Show } from "solid-js";

export type BoxType = "success" | "danger" | "special" | "gray";

type Props = WithChildren & {
  type?: BoxType;
  link?: string;
  linkLabel?: string;
  onClick?: () => void;
  onClose?: () => void;
};

export function Box(props: Props): JSX.Element {
  /* biome-ignore-start lint/a11y/noStaticElementInteractions: fix later
    biome-ignore-start lint/a11y/useKeyWithClickEvents: fix later */
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
  /* biome-ignore-end lint/a11y/useKeyWithClickEvents: fix later 
    biome-ignore-end lint/a11y/noStaticElementInteractions: fix later */
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
