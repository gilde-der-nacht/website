import { Show, type JSX } from "solid-js";
import type { WithChildren } from "@common/components/utils";

type Props = WithChildren & {
  type?: "success" | "danger" | "special" | "gray";
  link?: string;
  linkLabel?: string;
};

export function Box(props: Props): JSX.Element {
  return (
    <div class={`box-${props.type ?? "gray"}`}>
      <span>{props.children}</span>
      <Show when={props.link !== undefined && props.linkLabel !== undefined}>
        <a
          href={props.link ?? ""}
          class={`button button-small button-${props.type ?? "gray"}`}
        >
          <i class="fa-duotone fa-arrow-turn-down-right event-icon"></i>
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
