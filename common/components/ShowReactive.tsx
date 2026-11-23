import type { Reactive } from "@common/utils/reactivity";
import { Show, untrack, type JSX } from "solid-js";

export function ShowReactive<T>(props: {
  reactive$: Reactive<T | null>;
  children: (reactive$: Reactive<T>) => JSX.Element;
  fallback?: () => JSX.Element;
}): JSX.Element | null {
  return (
    <Show
      when={props.reactive$.unpackNull() !== null}
      fallback={props.fallback?.()}
    >
      {untrack(() => props.children(props.reactive$ as Reactive<T>))}
    </Show>
  );
}
