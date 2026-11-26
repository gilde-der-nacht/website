import { collapse, isPlainObject } from "@common/components/utils";
import type { Reactive } from "@common/utils/reactivity";
import type { FormState } from "@registration/State";
import type { UpdateView } from "@registration/messages/in";
import { toFormState } from "@registration/state/form";
import { toRaw, type Sync, type SyncLeaf } from "@registration/state/sync";
import debounce from "lodash-es/debounce";
import type { Connection } from "@registration/Connection";

export function updateInitialState(
  formState$: Reactive<FormState | null>,
  data: UpdateView,
): void {
  formState$.set({
    form: {
      myAccount: toFormState(data.data.data.myAccount),
      save: toFormState(data.data.data.save),
    },
    currentRevision: data.data.data.currentRevision,
  });
}

function trySyncImpl(data: Sync<FormState>, connection: Connection): void {
  const conflicts = collapse(
    (e): e is SyncLeaf<unknown> => isPlainObject(e) && e.kind === "FIELD",
    (leaf) => leaf.hasConflict,
  )(data.form);

  const hasConflicts = conflicts.some((c) => c);

  if (hasConflicts) {
    console.error("Has conflicts, can't sync");
    // TODO: toast
    return;
  }

  connection.send({
    kind: "SYNC_VIEW",
    currentRevision: data.currentRevision,
    form: toRaw(data.form),
  });
}
export const trySync = debounce(trySyncImpl, 1_000);

export function updateState() {}
