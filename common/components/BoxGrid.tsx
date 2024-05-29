import { type JSX } from "solid-js";

type Props = {
  children?: JSX.Element;
};

export function BoxGrid(props: Props): JSX.Element {
  return <div class="box-grid">{props.children}</div>;
}
