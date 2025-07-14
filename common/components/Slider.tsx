import type { JSX } from "solid-js";
import type { WithChildren } from "@common/components/utils";

type Props = WithChildren & {
  size?: "small";
};

export function Slider(props: Props): JSX.Element {
  const size: "small" | "default" = props.size ?? "default";

  return <div class={`slider slider-${size}`}>{props.children}</div>;
}
