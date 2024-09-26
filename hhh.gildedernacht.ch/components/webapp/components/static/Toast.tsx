import {
  IconLeft,
  type IconType,
} from "@hhh/components/webapp/components/static/icons/Icon";
import {
  Notification,
  type NotificationKind,
} from "@hhh/components/webapp/components/static/Notification";
import { isPromise } from "@hhh/components/webapp/util/utils";
import { createEffect, type JSX, mergeProps } from "solid-js";

export type ToastOptions = {
  isVisible?: boolean;
  kind?: NotificationKind | "loading";
  text?: string;
  waitFor?:
    | {
        promise: Promise<any>;
        onSuccessMessage: string;
        onErrorMessage: string;
      }
    | number;
};

type Props = {
  setToast: (o: ToastOptions) => void;
  hideToast: () => void;
};

export const Toast = (props: ToastOptions & Props): JSX.Element => {
  const merged = mergeProps({ isVisible: false, waitFor: 5_000 }, props);

  createEffect(() => {
    if (!merged.isVisible) {
      return;
    }
    if (typeof merged.waitFor === "number") {
      setTimeout(() => merged.hideToast(), merged.waitFor);
    } else if (merged.waitFor && isPromise(merged.waitFor?.promise)) {
      const { promise, onSuccessMessage, onErrorMessage } = merged.waitFor;
      promise
        .then(() =>
          merged.setToast({
            isVisible: true,
            text: onSuccessMessage,
            kind: "success",
            waitFor: 5_000,
          }),
        )
        .catch(() =>
          merged.setToast({
            isVisible: true,
            text: onErrorMessage,
            kind: "danger",
            waitFor: 10_000,
          }),
        );
    }
  });

  const iconName = (): IconType => {
    switch (merged.kind) {
      case "loading":
        return "spinner-third";
      case "danger":
        return "square-exclamation";
      case "success":
        return "square-check";
      default:
        return "square-info";
    }
  };

  return (
    <div class="hhh-toast" classList={{ hide: !merged.isVisible }}>
      <div class="container">
        <Notification
          kind={merged.kind === "loading" ? "info" : merged.kind}
          isLight={false}
        >
          <IconLeft icon={iconName()}>{merged.text}</IconLeft>
        </Notification>
      </div>
    </div>
  );
};
