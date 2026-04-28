import type { JSX } from "solid-js";

const ICONS = [
  "arrow-down",
  "arrow-right",
  "arrow-turn-down-right",
  "backward",
  "calendar-days",
  "calendar-range",
  "circle-check",
  "circle-max",
  "circle-plus",
  "circle-question",
  "circle-xmark",
  "chevrons-right",
  "dice-d20",
  "floppy-disk-circle-arrow-right",
  "forward",
  "grid-2-plus",
  "hand-heart",
  "link",
  "list",
  "list-radio",
  "location-dot",
  "location-smile",
  "mailbox",
  "moon-stars",
  "paper-plane",
  "pencil",
  "person-to-portal",
  "sun-bright",
  "spinner",
  "square-check",
  "tags",
  "ticket",
  "ticket-simple",
  "trash",
  "triangle-exclamation",
  "xmark",
] as const;
export type IconType = (typeof ICONS)[number];

export function Icon(props: {
  icon: IconType;
  rotating?: boolean;
  classes?: string[];
  style?: string;
}): JSX.Element {
  const classes = (props.classes ?? []).concat([
    "fa-duotone",
    `fa-${props.icon}`,
  ]);
  if (props.rotating === true) {
    classes.push("rotating");
  }
  return <i class={classes.join(" ")} style={props.style}></i>;
}
