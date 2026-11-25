import {
  assert,
  assertPlainObject,
  isArray,
  isPlainObject,
} from "@common/components/utils";
import { createStore } from "solid-js";

type IsNullable<T> = Extract<T, null> extends never ? false : true;

type UnpackNullResult<T> =
  IsNullable<T> extends true ? Reactive<NonNullable<T>> | null : never;

type SubFn<T> =
  T extends Record<string, unknown>
    ? <K extends keyof T & string>(key: K) => Reactive<T[K]>
    : never;

export type Reactive<T> = {
  get: () => T;
  set: (newValue: T) => void;
  update: (updateFn: (oldValue: T) => T) => void;
  unpackNull: () => UnpackNullResult<T>;
} & (T extends Record<string, unknown>
  ? {
      sub: SubFn<T>;
    }
  : {}) &
  (T extends readonly unknown[]
    ? {
        push: (newValue: T[number]) => void;
      }
    : {});

export type ListItem<T> = Reactive<T> & { remove: () => void };

function makeReactive<T>(
  get: () => T,
  write: (updateFn: (oldValue: T) => T) => void,
): Reactive<T> {
  const reactive: any = {
    get,
    set: (newValue: T) => write(() => newValue),
    update: write,
    pipe: (fn: (r: any) => unknown) => fn(reactive),
    isNull: () => get() === null,
    unpackNull: () => (get() === null ? null : makeReactive(get, write)),
  };

  reactive.sub = (key: string) => {
    const childGet = () => assertPlainObject(get(), `sub("${key}")`)[key];
    const childWrite = (updateFn: (old: unknown) => unknown) => {
      write((old) => {
        const obj = assertPlainObject(old, `sub("${key}") write`);
        return { ...obj, [key]: updateFn(obj[key]) } as T;
      });
    };
    return makeReactive(childGet, childWrite);
  };

  reactive.push = (newValue: unknown) => {
    write((old) => {
      if (!Array.isArray(old)) throw new Error("push(): value is not an array");
      return [...old, newValue] as T;
    });
  };

  return reactive as Reactive<T>;
}

export function createReactive<T>(init: T): Reactive<T> {
  const [store, setStore] = createStore({ value: init });

  return makeReactive(
    () => store.value,
    (updateFn) =>
      setStore((draft) => {
        draft.value = updateFn(draft.value);
      }),
  );
}

export function list<T, K extends string | number | symbol>(
  list$: Reactive<T[]>,
  keyOf: (item: T) => K,
) {
  const indexOf = (l: T[], key: K): number => {
    const idx = l.findIndex((item) => keyOf(item) === key);
    if (idx === -1) {
      throw new Error(
        `list.at(${String(key)}): item not found — was it removed? ` +
          `Keys must stay stable for the lifetime of a handle.`,
      );
    }
    return idx;
  };

  return {
    at(key: K): ListItem<T> {
      const elGet = () => {
        const l = list$.get();
        return l[indexOf(l, key)] as T;
      };
      const elWrite = (updateFn: (old: T) => T) => {
        list$.update((l) => {
          const idx = indexOf(l, key);
          const next = [...l];
          next[idx] = updateFn(l[idx] as T);
          return next;
        });
      };
      const el = makeReactive(elGet, elWrite) as ListItem<T>;
      el.remove = () => {
        list$.update((l) => l.filter((item) => keyOf(item) !== key));
      };
      return el;
    },
    append(item: T): void {
      list$.push(item);
    },
    keys: (): K[] => list$.get().map(keyOf),
  };
}

// @deprecated
function ensureExactlyOne<T>(list: T[], predicate: (el: T) => boolean): T {
  const [first, ...rest] = list.filter(predicate);
  assert(first !== undefined, "No element found with predicate");
  assert(rest.length === 0, "Predicate does not result in unique element");

  return first;
}

export type ReactiveArr<T> = Reactive<Array<T>>;

// @deprecated, use [list()] instead
export const arr = {
  update: <T>(
    reactive: ReactiveArr<T>,
    predicate: (el: T) => boolean,
    newValue: T,
  ): void => {
    reactive.update((oldValue) => {
      return oldValue.map((entry) => (predicate(entry) ? newValue : entry));
    });
  },
  remove: <T>(
    reactive: ReactiveArr<T>,
    predicate: (el: T) => boolean,
  ): void => {
    reactive.update((oldValue) => {
      return oldValue.filter((el) => !predicate(el));
    });
  },
  findExact: <T>(
    reactive: ReactiveArr<T>,
    predicate: (el: T) => boolean,
  ): Reactive<T> => {
    ensureExactlyOne(reactive.get(), predicate);

    return makeReactive(
      () => ensureExactlyOne(reactive.get(), predicate),
      (updateFn) => {
        const element = ensureExactlyOne(reactive.get(), predicate);
        arr.update(reactive, predicate, updateFn(element));
      },
    );
  },
  unpack: <T>(reactive: ReactiveArr<T>): ListItem<T>[] => {
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

/*
 * @deprecated
 */
function createReactiveArrEl<T>(
  get: () => T,
  update: (updateFn: (oldValue: T) => T) => void,
  remove: () => void,
): ListItem<T> {
  // @ts-ignore
  const reactive: ListItem<T> = {
    get,
    set: (newValue) => update(() => newValue),
    update,
    sub: (key) => {
      function getCurrentValue() {
        const currentValue = get();
        if (!isPlainObject(currentValue)) {
          throw new Error(
            "Cannot call sub(): value is not/no longer a plain object",
          );
        }
        return currentValue;
      }

      return makeReactive(
        () => getCurrentValue()[key],
        (updateFn) => {
          const oldObj = getCurrentValue();
          const newValue = updateFn(oldObj[key]);
          const newObj = { ...oldObj, [key]: newValue };
          update(() => newObj);
        },
      );
    },
    unpackNull: () => {
      if (get() === null) {
        return null;
      }

      return makeReactive(
        () => get(),
        (updateFn) => update(updateFn),
      );
    },
    push: (newValue) => {
      // @ts-ignore
      update((oldValue) => {
        if (!isArray(oldValue)) {
          throw new Error(
            "Cannot call push(): value is not/no longer an array",
          );
        }
        return [...oldValue, newValue];
      });
    },
    remove,
  };

  return reactive;
}
