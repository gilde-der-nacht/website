import type { JSX } from "astro/jsx-runtime";

type Props = {
  type?: "submit" | "button" | "reset";
  label: string;
};

export function Button(props: Props): JSX.Element {
  return (
    <button type={props.type ?? "button"} class="button-accent">
      {props.label}
    </button>
  );
}
