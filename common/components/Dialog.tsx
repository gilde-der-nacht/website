import { createEffect, Show, type JSX } from "solid-js";
import { createStore, type Store } from "solid-js/store";

export type DialogType = "success" | "danger" | "special" | "gray" | "warning";

export function Dialog(props: {
  store: Store<{ open: boolean }>;
  title?: string;
  type?: DialogType;
  children: JSX.Element;
}): JSX.Element {
  let dialogEl: HTMLDialogElement | undefined = undefined;
  const [store, setStore] = createStore(props.store);

  createEffect(() => {
    if (store.open) {
      (dialogEl as unknown as HTMLDialogElement).showModal();
    } else {
      (dialogEl as unknown as HTMLDialogElement).close();
    }
  });

  function close() {
    setStore({ open: false });
  }

  return (
    <dialog
      ref={dialogEl}
      onClose={close}
      class={`dialog-${props.type ?? "gray"}`}
    >
      <Show when={props.title}>{(title) => <h4>{title()}</h4>}</Show>
      {props.children}
    </dialog>
  );
}
