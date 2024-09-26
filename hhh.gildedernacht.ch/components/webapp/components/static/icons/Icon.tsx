import type { JSX } from "solid-js";

export type IconType =
  | "plus"
  | "check"
  | "trash"
  | "arrow-left"
  | "spinner-third"
  | "square-info"
  | "square-exclamation"
  | "square-check"
  | "bars-staggered"
  | "fork-knife"
  | "octagon-minus"
  | "octagon-plus"
  | "table-list"
  | "circle-stop"
  | "circle-play"
  | "xmark-large"
  | "receipt";

type Props = {
  icon: IconType;
};

export const Icon = (props: Props): JSX.Element => {
  return (
    <span class="icon">
      <i class={`fa-regular fa-${props.icon}`}></i>
    </span>
  );
};

export const IconLeft = (
  props: Props & { children: JSX.Element },
): JSX.Element => {
  return (
    <>
      <Icon icon={props.icon} /> <span>{props.children}</span>
    </>
  );
};
