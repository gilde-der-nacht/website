import { For, type JSX, mergeProps, Show } from "solid-js";

export type Tag = {
  label: string;
  kind?: "success" | "danger";
  link?: string;
  title?: string;
};

type Props = {
  isJustified?: boolean;
  tags: Tag[];
};

export const Tags = (props: Props): JSX.Element => {
  const merged = mergeProps({ isJustified: false }, props);

  return (
    <div
      class="tags"
      classList={{ "is-justify-content-center": merged.isJustified }}
    >
      <For each={merged.tags}>
        {(tag) => (
          <span class={`tag is-${tag.kind ?? ""}`} title={tag.title}>
            <Show when={tag.link?.length} fallback={tag.label}>
              <a href={tag.link} target="_blank">
                {tag.label}
              </a>
            </Show>
          </span>
        )}
      </For>
    </div>
  );
};
