import type { JSX } from "solid-js";
import type { WithChildren } from "@common/components/utils";

export function ImageText(
  props: WithChildren & { kind?: string },
): JSX.Element {
  return <div class={`image-text ${props.kind}`}>{props.children}</div>;
}

export function ImageTextLeft(props: WithChildren): JSX.Element {
  return <div class="image-text-left content">{props.children}</div>;
}

export function ImageTextRight(props: WithChildren): JSX.Element {
  return <div class="image-text-right content">{props.children}</div>;
}
