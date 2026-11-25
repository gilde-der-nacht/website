import type { JSX } from "@solidjs/web";
import type { WithChildren } from "@common/components/utils";

export function BoxGrid(props: WithChildren): JSX.Element {
  return <div class="box-grid">{props.children}</div>;
}
