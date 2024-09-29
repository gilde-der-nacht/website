import type { ApiProps } from "@hhh/components/webapp/api/api";
import { ENDPOINTS } from "@hhh/components/webapp/api/olymp";
import type { OrderBase } from "@hhh/components/webapp/util/BasicTypes";
import type { OrderCreate, OrderUpdate } from "../util/StateTypes";

const create =
  (props: ApiProps) =>
  async (
    order: Omit<OrderBase, "kind" | "id" | "created" | "updated">,
  ): Promise<Response> => {
    const body = {
      status: "published",
      restaurant: order.restaurantId,
      orderer: order.orderer,
      time_window: order.timeWindow,
      comment: order.comment,
    } satisfies OrderCreate;
    const promise = fetch(ENDPOINTS.ORDERS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    props.setToast({
      isVisible: true,
      text: "Bestellung speichern ...",
      kind: "loading",
      waitFor: {
        promise,
        onSuccessMessage: "Bestellung gespeichert.",
        onErrorMessage:
          "Bestellung konnte nicht gespeichert werden, bitte versuche es erneut",
      },
    });

    return promise.then((response) => {
      if (response.ok) {
        props.refetch();
        return response;
      }
      throw new Error(response.statusText);
    });
  };

const deactivate =
  (props: ApiProps) =>
  async (order: OrderBase): Promise<Response> => {
    const body = {
      uuid: order.id,
      status: "archived",
      restaurant: order.restaurantId,
      orderer: order.orderer,
      time_window: order.timeWindow,
      comment: order.comment,
    } satisfies OrderUpdate;
    const url = new URL([ENDPOINTS.ORDERS.href, order.id].join("/"));
    const promise = fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    props.setToast({
      isVisible: true,
      text: "Bestellung deaktivieren ...",
      kind: "loading",
      waitFor: {
        promise,
        onSuccessMessage: "Bestellung deaktiviert.",
        onErrorMessage:
          "Bestellung konnte nicht deaktiviert werden, bitte versuche es erneut",
      },
    });

    return promise.then((response) => {
      if (response.ok) {
        props.refetch();
        return response;
      }
      throw new Error(response.statusText);
    });
  };

const reactivate =
  (props: ApiProps) =>
  async (order: OrderBase): Promise<Response> => {
    const body = {
      uuid: order.id,
      status: "published",
      restaurant: order.restaurantId,
      orderer: order.orderer,
      time_window: order.timeWindow,
      comment: order.comment,
    } satisfies OrderUpdate;
    const url = new URL([ENDPOINTS.ORDERS.href, order.id].join("/"));
    const promise = fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    props.setToast({
      isVisible: true,
      text: "Bestellung reaktivieren ...",
      kind: "loading",
      waitFor: {
        promise,
        onSuccessMessage: "Bestellung reaktiviert.",
        onErrorMessage:
          "Bestellung konnte nicht reaktiviert werden, bitte versuche es erneut",
      },
    });

    return promise.then((response) => {
      if (response.ok) {
        props.refetch();
        return response;
      }
      throw new Error(response.statusText);
    });
  };

const remove =
  (props: ApiProps) =>
  async (order: OrderBase): Promise<Response> => {
    const url = new URL([ENDPOINTS.ORDERS.href, order.id].join("/"));
    const promise = fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    props.setToast({
      isVisible: true,
      text: "Bestellung löschen ...",
      kind: "loading",
      waitFor: {
        promise,
        onSuccessMessage: "Bestellung gelöscht.",
        onErrorMessage:
          "Bestellung konnte nicht gelöscht werden, bitte versuche es erneut",
      },
    });

    return promise.then((response) => {
      if (response.ok) {
        props.refetch();
        return response;
      }
      throw new Error(response.statusText);
    });
  };

export const OrderAPI = (props: ApiProps) => ({
  create: create(props),
  deactivate: deactivate(props),
  reactivate: reactivate(props),
  remove: remove(props),
});
