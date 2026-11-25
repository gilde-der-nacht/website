import type { JSX } from "@solidjs/web";
import { merge } from "solid-js";

export type NotificationKind = "success" | "danger" | "info";

type Props = {
  kind: NotificationKind | undefined;
  isLight?: boolean;
  children: JSX.Element;
};

export const Notification = (props: Props): JSX.Element => {
  const merged = merge({ type: "info", isLight: true }, props);

  return (
    <div
      class={{
        notification: true,
        [`is-${merged.kind}`]: true,
        "is-light": merged.isLight,
      }}
    >
      {merged.children}
    </div>
  );
};
