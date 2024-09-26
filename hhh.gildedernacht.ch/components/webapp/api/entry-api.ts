import type { ApiProps } from "@hhh/components/webapp/api/api";
import OLYMP from "@hhh/components/webapp/api/olymp";
import type { EntryBase } from "@hhh/components/webapp/util/BasicTypes";

const create =
  (props: ApiProps) =>
  async (
    entry: Omit<EntryBase, "kind" | "id" | "created" | "updated">,
  ): Promise<Response> => {
    const id = crypto.randomUUID();
    const promise = OLYMP.CREATE(props.refetch)({
      ...entry,
      id,
      status: "active",
      kind: "entry",
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
    return promise;
  };

const deactivate =
  (props: ApiProps) =>
  async (entry: EntryBase): Promise<Response> => {
    const promise = OLYMP.UPDATE(props.refetch)({
      ...entry,
      status: "inactive",
      kind: "entry",
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
    return promise;
  };

const reactivate =
  (props: ApiProps) =>
  async (entry: EntryBase): Promise<Response> => {
    const promise = OLYMP.UPDATE(props.refetch)({
      ...entry,
      status: "active",
      kind: "entry",
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
    return promise;
  };

const remove =
  (props: ApiProps) =>
  async (entry: EntryBase): Promise<Response> => {
    const promise = OLYMP.UPDATE(props.refetch)({
      ...entry,
      status: "deleted",
      kind: "entry",
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
    return promise;
  };

export const EntryAPI = (props: ApiProps) => ({
  create: create(props),
  deactivate: deactivate(props),
  reactivate: reactivate(props),
  remove: remove(props),
});
