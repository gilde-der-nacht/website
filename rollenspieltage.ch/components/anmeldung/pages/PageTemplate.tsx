import type { WithChildren } from "@common/components/utils";
import type { JSX } from "solid-js/jsx-runtime";

export function PageTemplate(
  props: WithChildren & { title: string },
): JSX.Element {
  return (
    <>
      <h2>{props.title}</h2>
      <br />
      {props.children}
    </>
  );
}
