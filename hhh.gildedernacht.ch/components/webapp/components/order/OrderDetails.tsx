import type { EntryUpdatePost } from "@hhh/components/webapp/api/ApiTypes";
import { EntryList } from "@hhh/components/webapp/components/entry/EntryList";
import { NewEntryForm } from "@hhh/components/webapp/components/entry/NewEntryForm";
import { IconLeft } from "@hhh/components/webapp/components/static/icons/Icon";
import { Notification } from "@hhh/components/webapp/components/static/Notification";
import { type Tag, Tags } from "@hhh/components/webapp/components/static/Tags";
import type {
  AppData,
  AppState,
  EntryState,
  OrderState,
} from "@hhh/components/webapp/util/StateTypes";
import { formatDate, hasBeenUpdated } from "@hhh/components/webapp/util/utils";
import { type Accessor, type JSX, type Setter, Show } from "solid-js";

type Props = {
  order: OrderState;
  data: AppData;
  goBack: () => void;
  createEntry: (
    entry: Omit<
      EntryUpdatePost,
      "status" | "id" | "kind" | "created" | "updated"
    >,
  ) => Promise<Response>;
  deactivateEntry: (entry: EntryState) => void;
  reactivateEntry: (entry: EntryState) => void;
  removeEntry: (entry: EntryState) => void;
  stateSignal: [Accessor<AppState>, Setter<AppState>];
};

export const OrderDetails = (props: Props): JSX.Element => {
  const restaurant = () => {
    const restaurant = props.data.restaurants.active.find(
      (r) => r.id === props.order.restaurantId,
    );
    if (typeof restaurant === "undefined") {
      throw new Error("This should not be able to happen!");
    }
    return restaurant;
  };

  const entries = {
    active: () =>
      props.data.entries.active.filter((e) => e.orderId === props.order.id),
    inactive: () =>
      props.data.entries.inactive.filter((e) => e.orderId === props.order.id),
  };

  const tags: Tag[] = [
    {
      label: props.order.status === "active" ? "aktiv" : "inaktiv",
      kind: props.order.status === "active" ? "success" : "danger",
    },
    { label: `Erstellt: ${formatDate(props.order.created)}` },
  ];
  if (hasBeenUpdated(props.order)) {
    tags.push({ label: `Bearbeitet: ${formatDate(props.order.updated)}` });
  } else {
    tags.push({
      label: `Deadline: ${formatDate(
        props.order.created.plus({ minutes: props.order.timeWindow }),
      )}`,
    });
  }

  return (
    <>
      <div>
        <h3 class="title is-3 has-text-centered">
          <IconLeft icon="table-list">
            <a
              href={restaurant().menuLink}
              target="_blank"
              class="has-text-dark"
            >
              <span class="pl-2">{restaurant().label}</span>
            </a>
            <span class="pl-2 has-text-info">({entries.active().length})</span>
            <small class="is-size-7 has-text-weight-normal ml-2">
              von {props.order.orderer}
            </small>
          </IconLeft>
        </h3>
        <Tags isJustified tags={tags} />
        <Show when={restaurant().comment}>
          <Notification kind="info">
            <p>
              <strong>Hinweis Restaurant</strong>{" "}
              <em>{restaurant().comment}</em>
            </p>
          </Notification>
        </Show>
        <Show when={props.order.comment}>
          <Notification kind="info">
            <p>
              <strong>Hinweis Bestellung</strong> <em>{props.order.comment}</em>
            </p>
          </Notification>
        </Show>
      </div>
      <Show when={props.order.status === "active"}>
        <NewEntryForm
          orderId={props.order.id}
          menuLink={restaurant().menuLink}
          createEntry={props.createEntry}
        />
      </Show>
      <EntryList
        activeEntries={entries.active()}
        inactiveEntries={entries.inactive()}
        deactivateEntry={props.deactivateEntry}
        reactivateEntry={props.reactivateEntry}
        removeEntry={props.removeEntry}
        stateSignal={props.stateSignal}
      />
    </>
  );
};
