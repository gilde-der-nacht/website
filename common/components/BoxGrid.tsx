import type { WithChildren } from "@common/components/utils";
import type { JSX } from "solid-js";

export function BoxGrid(props: WithChildren): JSX.Element {
  return <div class="box-grid">{props.children}</div>;
}
