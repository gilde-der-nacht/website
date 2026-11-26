import { isPlainObject, makeWalker } from "@common/components/utils";
import type { AnyForm, FormField } from "@registration/state/form";

export type SyncLeaf<T> = {
  kind: "FIELD";
  value: T;
  hasConflict: boolean;
};

export type Sync<T> = T extends readonly (infer I)[]
  ? ReadonlyArray<Sync<I>>
  : T extends FormField<infer R, infer _V>
    ? SyncLeaf<R>
    : { readonly [K in keyof T]: Sync<T[K]> };

function isFormField(w: unknown): w is FormField<unknown, unknown> {
  return isPlainObject(w) && w.kind === "FIELD";
}

export function toSync<T extends AnyForm>(form: T): Sync<T>;
export function toSync(form: AnyForm): unknown {
  return makeWalker(isFormField, (field) => ({
    kind: "FIELD" as const,
    value: field.formState,
    hasConflict: field.hasConflict,
  }))(form);
}

function isSyncLeaf(w: unknown): w is SyncLeaf<unknown> {
  return isPlainObject(w) && w.kind === "FIELD";
}

export type Raw<T> = T extends readonly (infer I)[]
  ? ReadonlyArray<Raw<I>>
  : T extends SyncLeaf<infer R>
    ? R
    : { readonly [K in keyof T]: Raw<T[K]> };

export function toRaw<T extends Sync<unknown>>(data: T): Raw<T>;
export function toRaw<T>(data: Sync<T>): unknown {
  return makeWalker(isSyncLeaf, (leaf) => leaf.value)(data);
}
