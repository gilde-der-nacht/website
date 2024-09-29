import type { ApiProps } from "@hhh/components/webapp/api/api";
import { ENDPOINTS } from "@hhh/components/webapp/api/olymp";
import type { EntryBase } from "@hhh/components/webapp/util/BasicTypes";
import type { EntryCreate, EntryUpdate } from "../util/StateTypes";

const create =
  (props: ApiProps) =>
  async (
    entry: Omit<EntryBase, "kind" | "id" | "created" | "updated">,
  ): Promise<Response> => {
    const body = {
      status: "published",
      order: entry.orderId,
      eater: entry.eater,
      menu_item: entry.menuItem,
      comment: entry.comment,
    } satisfies EntryCreate;
    const promise = fetch(ENDPOINTS.ENTRIES, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    props.setToast({
      isVisible: true,
      text: "Eintrag speichern ...",
      kind: "loading",
      waitFor: {
        promise,
        onSuccessMessage: "Eintrag gespeichert.",
        onErrorMessage:
          "Eintrag konnte nicht gespeichert werden, bitte versuche es erneut",
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
  async (entry: EntryBase): Promise<Response> => {
    const body = {
      uuid: entry.id,
      status: "archived",
      order: entry.orderId,
      eater: entry.eater,
      menu_item: entry.menuItem,
      comment: entry.comment,
    } satisfies EntryUpdate;
    const url = new URL([ENDPOINTS.ENTRIES.href, entry.id].join("/"));
    const promise = fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    props.setToast({
      isVisible: true,
      text: "Eintrag deaktivieren ...",
      kind: "loading",
      waitFor: {
        promise,
        onSuccessMessage: "Eintrag deaktiviert.",
        onErrorMessage:
          "Eintrag konnte nicht deaktiviert werden, bitte versuche es erneut",
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
  async (entry: EntryBase): Promise<Response> => {
    const body = {
      uuid: entry.id,
      status: "published",
      order: entry.orderId,
      eater: entry.eater,
      menu_item: entry.menuItem,
      comment: entry.comment,
    } satisfies EntryUpdate;
    const url = new URL([ENDPOINTS.ENTRIES.href, entry.id].join("/"));
    const promise = fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    props.setToast({
      isVisible: true,
      text: "Eintrag reaktivieren ...",
      kind: "loading",
      waitFor: {
        promise,
        onSuccessMessage: "Eintrag reaktiviert.",
        onErrorMessage:
          "Eintrag konnte nicht reaktiviert werden, bitte versuche es erneut",
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
  async (entry: EntryBase): Promise<Response> => {
    const url = new URL([ENDPOINTS.ENTRIES.href, entry.id].join("/"));
    const promise = fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    props.setToast({
      isVisible: true,
      text: "Eintrag löschen ...",
      kind: "loading",
      waitFor: {
        promise,
        onSuccessMessage: "Eintrag gelöscht.",
        onErrorMessage:
          "Eintrag konnte nicht gelöscht werden, bitte versuche es erneut",
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

export const EntryAPI = (props: ApiProps) => ({
  create: create(props),
  deactivate: deactivate(props),
  reactivate: reactivate(props),
  remove: remove(props),
});
