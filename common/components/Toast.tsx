import { For, type JSX } from "solid-js";
import { createStore } from "solid-js/store";

export type Toast = {
  uuid: string;
  kind: "accent" | "special" | "gray" | "success" | "danger";
  message: string;
  duration: number;
  cleanup: () => void;
};

export type ToastOptions = Partial<Pick<Toast, "uuid" | "kind" | "duration">>;

const [store, setStore] = createStore<Toast[]>([]);

export function Toast(props: {
  options: Toast;
  dismiss: () => void;
}): JSX.Element {
  const classes = () => {
    const cls = ["toast"];
    if (props.options.kind !== undefined) {
      cls.push(`toast-${props.options.kind}`);
    }
    return cls.join(" ");
  };

  return <div class={classes()}>{props.options.message}</div>;
}

export function ToastContainer(): JSX.Element {
  function dismiss(uuid: string): void {
    store.find((toast) => toast.uuid === uuid)?.cleanup();
    setStore(store.filter((toast) => toast.uuid !== uuid));
  }

  return (
    <div class="toast-container">
      <For each={store}>
        {(toast) => (
          <Toast options={toast} dismiss={() => dismiss(toast.uuid)} />
        )}
      </For>
    </div>
  );
}

export function toast(message: string, opts: ToastOptions): string {
  if (
    opts.uuid !== undefined &&
    store.find((toast) => toast.uuid === opts.uuid) !== undefined
  ) {
    return updateToast(opts.uuid, message, opts);
  }
  const uuid = opts.uuid ?? crypto.randomUUID();
  const duration = opts.duration ?? 5_000;
  const kind = opts.kind ?? "gray";

  const timer = setTimeout(() => {
    setStore(store.filter((toast) => toast.uuid !== uuid));
  }, duration);
  setStore(store.length, {
    uuid,
    kind,
    message,
    duration,
    cleanup: () => clearTimeout(timer),
  });

  return uuid;
}

export function updateToast(
  uuid: string,
  message: string,
  opts: ToastOptions,
): string {
  const toast = store.find((toast) => toast.uuid === uuid);
  if (toast === undefined) {
    return uuid;
  }
  toast.cleanup();
  const duration = opts.duration ?? toast.duration;
  const kind = opts.kind ?? toast.kind;
  const timer = setTimeout(() => {
    setStore(store.filter((toast) => toast.uuid !== uuid));
  }, duration);

  setStore((toast) => toast.uuid === uuid, {
    uuid,
    kind,
    message,
    duration,
    cleanup: () => clearTimeout(timer),
  });
  return uuid;
}
