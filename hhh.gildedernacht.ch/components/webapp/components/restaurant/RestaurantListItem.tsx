import { Card } from "@hhh/components/webapp/components/static/Card";
import type { Tag } from "@hhh/components/webapp/components/static/Tags";
import type { RestaurantState } from "@hhh/components/webapp/util/StateTypes";
import { formatDate, hasBeenUpdated } from "@hhh/components/webapp/util/utils";
import { type JSX, Show } from "solid-js";

type Props = {
  restaurant: RestaurantState;
  isDisabled: boolean;
  children: JSX.Element;
};

export const RestaurantListItem = (props: Props): JSX.Element => {
  const tags: Tag[] = [
    { label: `Erstellt: ${formatDate(props.restaurant.created)}` },
  ];

  if (hasBeenUpdated(props.restaurant)) {
    tags.push({ label: `Bearbeitet: ${formatDate(props.restaurant.updated)}` });
  }

  return (
    <Card isDisabled={props.isDisabled} tags={tags}>
      <div class="is-flex is-flex-wrap-wrap is-justify-content-space-between is-align-items-start">
        <div>
          <h5 class="m-0">{props.restaurant.label}</h5>
          <p class="is-italic">
            <a href={props.restaurant.menuLink} target="_blank">
              {props.restaurant.menuLink}
            </a>
          </p>
          <Show when={props.restaurant.comment.trim().length > 0}>
            <p class="is-italic">{props.restaurant.comment}</p>
          </Show>
        </div>
        {props.children}
      </div>
    </Card>
  );
};
