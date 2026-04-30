import { Show, type JSX } from "solid-js";
import { Dynamic } from "solid-js/web";
import type { WithChildren } from "@common/components/utils";
import { Icon, type IconType } from "@common/components/Icon";

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
  moreLink?: {
    label: string;
    link: string;
    icon?: IconType;
  };
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
    <div style="display: flex; flex-wrap: wrap; gap: 1rem; justify-content: space-between; align-items: center;">
      <Dynamic component={`h${props.level}`} id={id}>
        <a href={`#${id}`} class="header-anchor">
          {"title" in props ? props.title : props.children}
        </a>
      </Dynamic>
      <Show when={props.moreLink}>
        {(moreLink) => (
          <a href={moreLink().link} style="border: none;">
            {moreLink().label}
            <Show when={moreLink().icon}>
              {(icon) => (
                <span style="margin-inline-start: 0.25rem;">
                  <Icon icon={icon()} />
                </span>
              )}
            </Show>
          </a>
        )}
      </Show>
    </div>
  );
}
