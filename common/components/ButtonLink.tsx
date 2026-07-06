import type { JSX } from "solid-js";
import { Icon } from "@common/components/Icon";

type Props = {
  link: string;
  label: string;
  kind?: "accent" | "special" | "gray" | "success" | "danger";
};

export function ButtonLink(props: Props): JSX.Element {
  return (
    <a
      href={props.link}
      class={`button button-small button-${props.kind ?? "special"}`}
    >
      <Icon icon="arrow-turn-down-right" classes={["event-icon"]} />
      <span> {props.label}</span>
    </a>
  );
}
