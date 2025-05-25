import type { JSX } from "solid-js";

export function Chip(props: {
  kind?: "special" | "gray" | "success" | "danger" | "warning";
  children: JSX.Element;
}): JSX.Element {
  return <span class={`chip ${props.kind ?? "gray"}`}>{props.children}</span>;
}
