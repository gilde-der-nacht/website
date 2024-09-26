import { type JSX, mergeProps } from "solid-js";

export type NotificationKind = "success" | "danger" | "info";

type Props = {
  kind: NotificationKind | undefined;
  isLight?: boolean;
  children: JSX.Element;
};

export const Notification = (props: Props): JSX.Element => {
  const merged = mergeProps({ type: "info", isLight: true }, props);

  return (
    <div
      class={`notification is-${merged.kind}`}
      classList={{
        "is-light": merged.isLight,
      }}
    >
      {merged.children}
    </div>
  );
};
