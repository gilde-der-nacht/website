import type { JSX } from "solid-js";
import type { WithChildren } from "@common/components/utils";
import { A, useNavigate } from "@solidjs/router";

export function Link(
  props: WithChildren<{ href: string; class?: string; style?: string }>,
): JSX.Element {
  return (
    <A href={ensureSecret(props.href)} class={props.class} style={props.style}>
      {props.children}
    </A>
  );
}

export function useLink(): (path: string) => void {
  const navigate = useNavigate();
  return (path) => {
    navigate(ensureSecret(path));
  };
}

function ensureSecret(path: string): string {
  const url = URL.parse(location.toString().replace("#/", "")); // bit hacky to work with Solid Router
  const secret = url?.searchParams.get("secret") ?? null;
  return secret === null ? path : `${path}?secret=${secret}`;
}
