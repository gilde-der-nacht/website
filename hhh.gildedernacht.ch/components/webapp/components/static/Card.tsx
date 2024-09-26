import { type Tag, Tags } from "@hhh/components/webapp/components/static/Tags";
import { type JSX, mergeProps } from "solid-js";

type Props = {
  isDisabled?: boolean;
  showStatusTag?: boolean;
  tags?: Tag[];
  children: JSX.Element;
};

export const Card = (props: Props): JSX.Element => {
  const merged = mergeProps(
    { isDisabled: false, showStatusTag: true, tags: [] },
    props,
  );
  const tags: Tag[] = [];
  if (merged.showStatusTag) {
    tags.push({
      label: merged.isDisabled ? "inaktiv" : "aktiv",
      kind: merged.isDisabled ? "danger" : "success",
    });
  }
  tags.push(...merged.tags);

  return (
    <div class="card" classList={{ "hhh-card-disabled": merged.isDisabled }}>
      <div class="card-content">
        <div class="content">{merged.children}</div>
        <Tags tags={tags} />
      </div>
    </div>
  );
};
