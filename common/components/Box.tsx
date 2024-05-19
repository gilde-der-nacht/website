import { Show, type JSX } from "solid-js";

type Props = {
  type: "success" | "danger" | "special" | "gray";
  link?: string;
  linkLabel?: string;
  children?: JSX.Element;
}

export function Box(props: Props): JSX.Element {
  return (
    <div class={`box-${props.type}`}>
      <span>{props.children}</span>
      <Show when={props.link !== undefined && props.linkLabel !== undefined}>
        <a href={props.link ?? ""} class={`button button-small button-${props.type}`}>
          <i class="fa-duotone fa-arrow-turn-down-right event-icon"></i> {props.linkLabel}
        </a>
      </Show>
    </div>
  )
}
