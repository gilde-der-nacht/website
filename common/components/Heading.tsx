import { type JSX } from "solid-js";
import { Dynamic } from "solid-js/web";
import type { WithChildren } from "./utils";

type Level = 1 | 2 | 3 | 4;

function toKebabCase(str: string): string {
  return encodeURIComponent(
    str
      .replaceAll(/\s/g, "-")
      .replaceAll("&", "")
      .replaceAll(/-{1,}/g, "-")
      .toLocaleLowerCase(),
  );
}

type HeadingProps = {
  level: Level;
} & (
  | {
      title: string;
      id?: string;
    }
  | (WithChildren & {
      id: string;
    })
);

export function Heading(props: HeadingProps): JSX.Element {
  const id = toKebabCase(
    "title" in props ? (props.id ?? props.title) : props.id,
  );
  return (
    <Dynamic component={`h${props.level}`} id={id}>
      <a href={`#${id}`} class="header-anchor">
        {"title" in props ? props.title : props.children}
      </a>
    </Dynamic>
  );
}
