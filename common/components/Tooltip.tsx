import type { JSX } from "solid-js";
import type { WithChildren } from "./utils";

export function Tooltip(
  props: WithChildren & { tooltip: string },
): JSX.Element {
  return (
    <div class="tooltip-wrapper">
      <div class="tooltip">{props.tooltip}</div>
      {props.children}
    </div>
  );
}
