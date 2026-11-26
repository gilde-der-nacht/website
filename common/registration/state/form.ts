import { isPlainObject, makeWalker } from "@common/components/utils";
import type { FieldView, LeafValidated, View } from "@registration/state/codec";
// import isEqual from "lodash-es/isEqual";

export type Form<T> = T extends readonly (infer I)[]
  ? ReadonlyArray<Form<I>>
  : T extends FieldView<infer R, infer V>
    ? FormField<R, V>
    : { readonly [K in keyof T]: Form<T[K]> };

export type FormField<R, V> = {
  kind: "FIELD";
  remote: R;
  formState: R;
  validated: LeafValidated<V>;
  isDirty: boolean;
  hasConflict: boolean;
};

export type AnyForm =
  | FormField<unknown, unknown>
  | readonly AnyForm[]
  | { readonly [key: string]: AnyForm };

function isFieldView(w: unknown): w is FieldView<unknown, unknown> {
  return (
    isPlainObject(w) && w.kind === "FIELD" && "raw" in w && "validated" in w
  );
}

export function toFormState<T extends View>(wire: T): Form<T>;
export function toFormState(wire: View): unknown {
  return makeWalker(isFieldView, (field) => ({
    kind: "FIELD",
    remote: field.raw,
    validated: field.validated,
    formState: field.raw,
    hasConflict: false,
    isDirty: false,
  }))(wire);
}

/*
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
*/
