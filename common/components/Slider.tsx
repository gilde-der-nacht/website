import { type JSX } from "solid-js";

type Props = {
  size?: "small";
  children?: JSX.Element;
}

export function Slider(props: Props): JSX.Element {
  const size: "small" | "default" = props.size ?? "default";

  return (
    <div class={`slider slider-${size}`}>
      {props.children}
    </div>
  )
}
