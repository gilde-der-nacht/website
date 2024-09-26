import { Card } from "@hhh/components/webapp/components/static/Card";
import type { Tag } from "@hhh/components/webapp/components/static/Tags";
import type { EntryState } from "@hhh/components/webapp/util/StateTypes";
import { formatDate, hasBeenUpdated } from "@hhh/components/webapp/util/utils";
import { type JSX, Show } from "solid-js";

type Props = {
  entry: EntryState;
  isDisabled: boolean;
  children: JSX.Element;
};

export const EntryListItem = (props: Props): JSX.Element => {
  const tags: Tag[] = [
    { label: `Erstellt: ${formatDate(props.entry.created)}` },
  ];

  if (hasBeenUpdated(props.entry)) {
    tags.push({ label: `Bearbeitet: ${formatDate(props.entry.updated)}` });
  }

  return (
    <Card isDisabled={props.isDisabled} tags={tags}>
      <div class="is-flex is-flex-wrap-wrap is-justify-content-space-between">
        <div>
          <h5 class="m-0">{props.entry.menuItem}</h5>
          <p class="is-italic">{props.entry.eater}</p>
          <Show when={props.entry.comment.trim().length > 0}>
            <p class="is-italic">{props.entry.comment}</p>
          </Show>
        </div>
        {props.children}
      </div>
    </Card>
  );
};
