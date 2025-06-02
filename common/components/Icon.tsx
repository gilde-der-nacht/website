import type { JSX } from "solid-js";

const ICONS = [
  "arrow-turn-down-right",
  "backward",
  "calendar-range",
  "circle-check",
  "circle-max",
  "circle-plus",
  "circle-xmark",
  "dice-d20",
  "floppy-disk-circle-arrow-right",
  "grid-2-plus",
  "hand-heart",
  "list",
  "location-dot",
  "moon-stars",
  "paper-plane",
  "sun-bright",
  "square-check",
  "tags",
  "trash",
  "triangle-exclamation",
  "xmark",
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
