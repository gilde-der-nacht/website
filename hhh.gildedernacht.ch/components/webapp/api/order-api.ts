import type { ApiProps } from "@hhh/components/webapp/api/api";
import OLYMP from "@hhh/components/webapp/api/olymp";
import type { OrderBase } from "@hhh/components/webapp/util/BasicTypes";

const create =
  (props: ApiProps) =>
  async (
    order: Omit<OrderBase, "kind" | "id" | "created" | "updated">,
  ): Promise<Response> => {
    const id = crypto.randomUUID();
    const promise = OLYMP.CREATE(props.refetch)({
      ...order,
      id,
      status: "auto",
      kind: "order",
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
    return promise;
  };

const deactivate =
  (props: ApiProps) =>
  async (order: OrderBase): Promise<Response> => {
    const promise = OLYMP.UPDATE(props.refetch)({
      ...order,
      status: "inactive",
      kind: "order",
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
    return promise;
  };

const reactivate =
  (props: ApiProps) =>
  async (order: OrderBase): Promise<Response> => {
    const promise = OLYMP.UPDATE(props.refetch)({
      ...order,
      status: "active",
      kind: "order",
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
    return promise;
  };

const remove =
  (props: ApiProps) =>
  async (order: OrderBase): Promise<Response> => {
    const promise = OLYMP.UPDATE(props.refetch)({
      ...order,
      status: "deleted",
      kind: "order",
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
    return promise;
  };

export const OrderAPI = (props: ApiProps) => ({
  create: create(props),
  deactivate: deactivate(props),
  reactivate: reactivate(props),
  remove: remove(props),
});
