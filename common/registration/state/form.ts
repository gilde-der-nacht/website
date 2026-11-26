import type { FieldView, LeafValidated } from "@registration/state/codec";
import isEqual from "lodash-es/isEqual";

export type FormField<R, V> = {
  remote: R;
  formState: R;
  validated: LeafValidated<V>;
  isDirty: boolean;
  hasConflict: boolean;
};

export function updateState<R, V>(
  incoming: FieldView<R, V>,
  oldState: FormField<R, V>,
  flagConflicts: boolean,
): FormField<R, V> {
  const hasConflict =
    oldState.hasConflict ||
    (flagConflicts &&
      oldState.isDirty &&
      !isEqual(oldState.remote, incoming.raw));

  return {
    remote: incoming.raw,
    validated: incoming.validated,
    formState: hasConflict
      ? oldState.formState
      : isEqual(oldState.remote, oldState.formState)
        ? incoming.raw
        : oldState.formState,
    isDirty: hasConflict,
    hasConflict,
  };
}

export type UpdateState<R, V> = typeof updateState<R, V>;
