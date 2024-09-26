import { type Tag, Tags } from "@hhh/components/webapp/components/static/Tags";
import { For, type JSX, mergeProps, Show } from "solid-js";

type GridProps<T> = {
  each: readonly T[];
  barter?: (item: T) => GridElementFooter[];
  tags?: (item: T) => Tag[];
  children: (item: T) => JSX.Element;
  isDisabled: boolean;
  showStatusTag: boolean;
};

export const Grid = <T,>(props: GridProps<T>): JSX.Element => {
  const merged = mergeProps({ barter: () => [], tags: () => [] }, props);

  return (
    <div class="hhh-grid">
      <For each={merged.each}>
        {(item) => (
          <GridElement
            footer={merged.barter(item)}
            tags={merged.tags(item)}
            isDisabled={merged.isDisabled}
            showStatusTag={merged.showStatusTag}
          >
            {merged.children(item)}
          </GridElement>
        )}
      </For>
    </div>
  );
};

export type GridElementFooter = {
  title?: string;
  label: JSX.Element;
  onClick: () => void;
  kind?: "danger" | "success";
};

type GridElementProps = {
  footer: GridElementFooter[];
  tags: Tag[];
  isDisabled: boolean;
  showStatusTag: boolean;
  children: JSX.Element;
};

const GridElement = (props: GridElementProps): JSX.Element => {
  const tags: Tag[] = [];
  if (props.showStatusTag) {
    tags.push({
      label: props.isDisabled ? "inaktiv" : "aktiv",
      kind: props.isDisabled ? "danger" : "success",
    });
  }
  tags.push(...props.tags);
  return (
    <div class="card hhh-card">
      <div class="card-content">
        {props.children}
        <Tags tags={tags} />
      </div>
      <Show when={props.footer.length > 0}>
        <footer class="card-footer hhh-card-footer">
          <For each={props.footer}>
            {(entry) => (
              <a
                title={entry.title}
                class="card-footer-item"
                classList={{
                  [`has-text-${entry.kind}`]: typeof entry.kind === "string",
                }}
                onClick={entry.onClick}
              >
                {entry.label}
              </a>
            )}
          </For>
        </footer>
      </Show>
    </div>
  );
};
