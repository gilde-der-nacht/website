import type { JSX } from "@solidjs/web";
import { merge } from "solid-js";

type Props = {
  title?: string;
  color?: "primary" | "success" | "danger" | "warning";
  isOutlined?: boolean;
  isLarge?: boolean;
  isSubmit?: boolean;
  onClick: (e: Event) => void;
  children: JSX.Element;
};

export const Button = (props: Props): JSX.Element => {
  const merged = merge(
    { color: "primary", isOutlined: false, isLarge: false, isSubmit: false },
    props,
  );

  return (
    <button
      type={merged.isSubmit ? "submit" : "button"}
      title={merged.title}
      class={{
        "is-outlined": merged.isOutlined,
        "is-medium": merged.isLarge,
        button: true,
        [`is-${merged.color}`]: true,
      }}
      onClick={merged.onClick}
    >
      {merged.children}
    </button>
  );
};
