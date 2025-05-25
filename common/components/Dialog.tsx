import type { JSX } from "solid-js";

export function Dialog(props: { children: JSX.Element }): JSX.Element {
  return <dialog open>{props.children}</dialog>;
}
