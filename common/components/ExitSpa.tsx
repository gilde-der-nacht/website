import type { JSX } from "solid-js";
import type { WithChildren } from "@common/components/utils";

export function ExitSpa(props: WithChildren<{ href: string }>): JSX.Element {
  return (
    <a
      href="?"
      onclick={(e) => {
        e.preventDefault();
        globalThis.location.href = `${globalThis.location.origin}${props.href}`;
      }}
    >
      {props.children}
    </a>
  );
}
