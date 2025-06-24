import type { JSX } from "solid-js";

export function Chip(props: {
  kind?: "special" | "gray" | "success" | "danger" | "warning";
  inverted?: boolean;
  title?: string;
  size?: "small";
  children: JSX.Element;
}): JSX.Element {
  const classes = () => {
    const cls = ["chip"];
    cls.push(props.kind ?? "gray");
    if (props.inverted) {
      cls.push("inverted");
    }
    if (props.size === "small") {
      cls.push("small");
    }
    return cls.join(" ");
  };

  return (
    <span class={classes()} title={props.title}>
      {props.children}
    </span>
  );
}
