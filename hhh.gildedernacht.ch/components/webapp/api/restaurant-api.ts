import type { ApiProps } from "@hhh/components/webapp/api/api";
import { ENDPOINTS } from "@hhh/components/webapp/api/olymp";
import type { RestaurantBase } from "@hhh/components/webapp/util/BasicTypes";
import type { RestaurantCreate, RestaurantUpdate } from "../util/StateTypes";

const create =
  (props: ApiProps) =>
  async (
    restaurant: Omit<RestaurantBase, "kind" | "id" | "created" | "updated">,
  ): Promise<Response> => {
    const body = {
      status: "published",
      name: restaurant.label,
      link: restaurant.menuLink,
      comment: restaurant.comment,
    } satisfies RestaurantCreate;
    const promise = fetch(ENDPOINTS.RESTAURANTS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    props.setToast({
      isVisible: true,
      text: "Restaurant speichern ...",
      kind: "loading",
      waitFor: {
        promise,
        onSuccessMessage: "Restaurant gespeichert.",
        onErrorMessage:
          "Restaurant konnte nicht gespeichert werden, bitte versuche es erneut",
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
  async (restaurant: RestaurantBase): Promise<Response> => {
    const body = {
      uuid: restaurant.id,
      status: "archived",
      name: restaurant.label,
      link: restaurant.menuLink,
      comment: restaurant.comment,
    } satisfies RestaurantUpdate;
    const url = new URL([ENDPOINTS.RESTAURANTS.href, restaurant.id].join("/"));
    const promise = fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    props.setToast({
      isVisible: true,
      text: "Restaurant deaktivieren ...",
      kind: "loading",
      waitFor: {
        promise,
        onSuccessMessage: "Restaurant deaktiviert.",
        onErrorMessage:
          "Restaurant konnte nicht deaktiviert werden, bitte versuche es erneut",
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
  async (restaurant: RestaurantBase): Promise<Response> => {
    const body = {
      uuid: restaurant.id,
      status: "published",
      name: restaurant.label,
      link: restaurant.menuLink,
      comment: restaurant.comment,
    } satisfies RestaurantUpdate;
    const url = new URL([ENDPOINTS.RESTAURANTS.href, restaurant.id].join("/"));
    const promise = fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    props.setToast({
      isVisible: true,
      text: "Restaurant reaktivieren ...",
      kind: "loading",
      waitFor: {
        promise,
        onSuccessMessage: "Restaurant reaktiviert.",
        onErrorMessage:
          "Restaurant konnte nicht reaktiviert werden, bitte versuche es erneut",
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
  async (restaurant: RestaurantBase): Promise<Response> => {
    const url = new URL([ENDPOINTS.RESTAURANTS.href, restaurant.id].join("/"));
    const promise = fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    props.setToast({
      isVisible: true,
      text: "Restaurant löschen ...",
      kind: "loading",
      waitFor: {
        promise,
        onSuccessMessage: "Restaurant gelöscht.",
        onErrorMessage:
          "Restaurant konnte nicht gelöscht werden, bitte versuche es erneut",
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

export const RestaurantAPI = (props: ApiProps) => ({
  create: create(props),
  deactivate: deactivate(props),
  reactivate: reactivate(props),
  remove: remove(props),
});
