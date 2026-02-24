import { assert } from "@common/components/utils";
import { createStore } from "solid-js/store";

export type Reactive<T> = {
  get: () => T;
  set: (newValue: T) => void;
  update: (updateFn: (oldValue: T) => T) => void;
  pipe: <U>(fn: (reactive: Reactive<T>) => U) => U;
};

export type ReactiveObj<T extends object> = Reactive<T>;

export type ReactiveArr<T> = Reactive<Array<T>>;

export type ReactiveArrEl<T> = Reactive<T> & { remove: () => void };

function createReactiveImpl<T>(
  get: () => T,
  update: (updateFn: (oldValue: T) => T) => void,
): Reactive<T> {
  const reactive: Reactive<T> = {
    get,
    set: (newValue) => update(() => newValue),
    update,
    pipe: (fn) => fn(reactive),
  };

  return reactive;
}

function createReactiveArrEl<T>(
  get: () => T,
  update: (updateFn: (oldValue: T) => T) => void,
  remove: () => void,
): ReactiveArrEl<T> {
  const reactive: ReactiveArrEl<T> = {
    get,
    set: (newValue) => update(() => newValue),
    update,
    pipe: (fn) => fn(reactive),
    remove,
  };

  return reactive;
}

export function createReactive<T>(init: T): Reactive<T> {
  const [store, setStore] = createStore({ value: init });

  return createReactiveImpl(
    () => store.value,
    (updateFn) => setStore("value", updateFn(store.value)),
  );
}

export const obj = {
  sub: <K extends keyof T, T extends object>(
    key: K,
  ): ((reactive: ReactiveObj<T>) => Reactive<T[K]>) => {
    return (reactive) => {
      return createReactiveImpl(
        () => reactive.get()[key],
        (updateFn) =>
          reactive.update((oldValue) => ({
            ...oldValue,
            [key]: updateFn(reactive.get()[key]),
          })),
      );
    };
  },
};

export const arr = {
  push: <T,>(reactive: ReactiveArr<T>, newValue: T): void => {
    reactive.update((oldValue) => {
      return [...oldValue, newValue];
    });
  },
  update: <T,>(
    reactive: ReactiveArr<T>,
    predicate: (el: T) => boolean,
    newValue: T,
  ): void => {
    reactive.update((oldValue) => {
      return oldValue.map((entry) => (predicate(entry) ? newValue : entry));
    });
  },
  remove: <T,>(
    reactive: ReactiveArr<T>,
    predicate: (el: T) => boolean,
  ): void => {
    reactive.update((oldValue) => {
      return oldValue.filter(predicate);
    });
  },
  findExact: <T,>(
    reactive: ReactiveArr<T>,
    predicate: (el: T) => boolean,
  ): Reactive<T> => {
    ensureExactlyOne(reactive.get(), predicate);

    return createReactiveImpl(
      () => ensureExactlyOne(reactive.get(), predicate),
      (updateFn) => {
        const element = ensureExactlyOne(reactive.get(), predicate);
        arr.update(reactive, predicate, updateFn(element));
      },
    );
  },
  unpack: <T,>(reactive: ReactiveArr<T>): ReactiveArrEl<T>[] => {
    return reactive.get().map((value, index) => {
      return createReactiveArrEl<T>(
        () => value,
        (updateFn) => {
          reactive.update((oldValue) => {
            const newValue = [...oldValue];
            newValue[index] = updateFn(value);
            return newValue;
          });
        },
        () => {
          reactive.update((oldValue) =>
            oldValue.slice(0, index).concat(oldValue.slice(index + 1)),
          );
        },
      );
    });
  },
};

function ensureExactlyOne<T>(list: T[], predicate: (el: T) => boolean): T {
  const [first, ...rest] = list.filter(predicate);
  assert(first !== undefined, "No element found with predicate");
  assert(rest.length === 0, "Predicate does not result in unique element");

  return first;
}
