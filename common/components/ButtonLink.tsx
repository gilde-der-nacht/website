import { type JSX } from "solid-js";

type Props = {
  link: string;
  label: string;
}

export function ButtonLink(props: Props): JSX.Element {
  return (
    <a href={props.link} class="button button-small button-special">
      <i class="fa-duotone fa-arrow-turn-down-right event-icon"></i>
      {props.label}
    </a>
  )
}
