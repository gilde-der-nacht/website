import { type JSX } from "solid-js";

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
      <i class="fa-duotone fa-arrow-turn-down-right event-icon"></i>
      <span> {props.label}</span>
    </a>
  );
}
