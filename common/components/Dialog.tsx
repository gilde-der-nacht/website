import { createEffect, Show, type JSX } from "solid-js";
import { createStore, type Store } from "solid-js/store";
import { IconOnlyButton } from "@common/components/Button";

export type DialogType = "success" | "danger" | "special" | "gray" | "warning";

export function initDialogStore(open: boolean = false): DialogStore {
  return { open };
}

export type DialogStore = { open: boolean };

export function Dialog(props: {
  store: Store<DialogStore>;
  title?: string;
  type?: DialogType;
  size?: "medium" | "large";
  onClose?: () => void;
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
    props.onClose?.();
  }

  const classes = () => {
    const cls: string[] = [];
    if (props.type !== undefined) {
      cls.push(props.type);
    }
    if (props.size !== undefined) {
      cls.push(props.size);
    }
    if (props.onClose !== undefined) {
      cls.push("dialog-with-close");
    }

    return cls;
  };

  return (
    <>
      <dialog ref={dialogEl} onClose={close} class={classes().join(" ")}>
        <Show when={props.onClose}>
          <IconOnlyButton onClick={close} icon="circle-xmark" kind="gray" />
        </Show>
        <Show when={props.title}>{(title) => <h4>{title()}</h4>}</Show>
        {props.children}
      </dialog>
    </>
  );
}
