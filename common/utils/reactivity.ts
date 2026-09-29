import { assert, isPlainObject } from "@common/components/utils";
import { createStore } from "solid-js/store";

export type Reactive<T> = {
  get: () => T;
  set: (newValue: T) => void;
  update: (updateFn: (oldValue: T) => T) => void;
  pipe: <U>(fn: (reactive: Reactive<T>) => U) => U;
} & (T extends Record<string, unknown>
  ? {
      sub: <K extends keyof T>(key: K) => Reactive<T[K]>;
    }
  : {});

export type ReactiveObj<T extends object> = Reactive<T>;

export type ReactiveArr<T> = Reactive<Array<T>>;

export type ReactiveArrEl<T> = Reactive<T> & { remove: () => void };

function createReactiveImpl<T>(
  get: () => T,
  update: (updateFn: (oldValue: T) => T) => void,
): Reactive<T> {
  // @ts-ignore
  const reactive: Reactive<T> = {
    get,
    set: (newValue) => update(() => newValue),
    update,
    pipe: (fn) => fn(reactive),
    sub: (key) => {
      const currentValue = get();
      if (!isPlainObject(currentValue)) {
        throw new Error(
          "Cannot call sub(): value is not/no longer a plain object",
        );
      }

      return createReactiveImpl(
        () => currentValue[key],
        (updateFn) => {
          const oldObj = currentValue;
          const newValue = updateFn(oldObj[key]);
          const newObj = { ...oldObj, [key]: newValue };
          update(() => newObj);
        },
      );
    },
  };

  return reactive;
}

function createReactiveArrEl<T>(
  get: () => T,
  update: (updateFn: (oldValue: T) => T) => void,
  remove: () => void,
): ReactiveArrEl<T> {
  // @ts-ignore
  const reactive: ReactiveArrEl<T> = {
    get,
    set: (newValue) => update(() => newValue),
    update,
    pipe: (fn) => fn(reactive),
    sub: (key) => {
      const currentValue = get();
      if (!isPlainObject(currentValue)) {
        throw new Error(
          "Cannot call sub(): value is not/no longer a plain object",
        );
      }

      return createReactiveImpl(
        () => currentValue[key],
        (updateFn) => {
          const oldObj = currentValue;
          const newValue = updateFn(oldObj[key]);
          const newObj = { ...oldObj, [key]: newValue };
          update(() => newObj);
        },
      );
    },
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
      return oldValue.filter((el) => !predicate(el));
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
