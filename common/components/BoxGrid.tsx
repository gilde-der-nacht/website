import type { JSX } from "solid-js";
import type { WithChildren } from "@common/components/utils";

export function BoxGrid(props: WithChildren): JSX.Element {
  return <div class="box-grid">{props.children}</div>;
}
