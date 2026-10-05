import type { Reactive } from "@common/utils/reactivity";
import type { JSX } from "solid-js";

export function ShowReactive<T>(props: {
  reactive$: Reactive<T | null>;
  children: (reactive$: Reactive<T>) => JSX.Element;
  fallback?: () => JSX.Element;
}): JSX.Element | null {
  return (
    <>
      {props.reactive$.unpackNull() === null
        ? props.fallback?.()
        : props.children(props.reactive$.unpackNull() as Reactive<T>)}
    </>
  );
}
