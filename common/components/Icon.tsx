import type { JSX } from "solid-js";

const ICONS = [
  "arrow-turn-down-right",
  "calendar-range",
  "circle-max",
  "circle-xmark",
  "dice-d20",
  "grid-2-plus",
  "hand-heart",
  "location-dot",
  "moon-stars",
  "sun-bright",
  "square-check",
  "tags",
] as const;
export type IconType = (typeof ICONS)[number];

export function Icon(props: {
  icon: IconType;
  classes?: string[];
  style?: string;
}): JSX.Element {
  const classes = (props.classes ?? []).concat([
    "fa-duotone",
    `fa-${props.icon}`,
  ]);
  return <i class={classes.join(" ")} style={props.style}></i>;
}
