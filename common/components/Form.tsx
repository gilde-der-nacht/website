import { mergeProps, type JSX } from "solid-js";

type Props = {
  submitLabel?: string;
  language?: "de" | "en";
  children?: JSX.Element;
}

export function Form(props: Props): JSX.Element {
  const propsWithDefaults = mergeProps({ language: "de", submitLabel: props.language === "en" ? "Submit" : "Absenden" }, props);

  return (
    <form action="https://elysium.gildedernacht.ch/forms" method="post">
      {propsWithDefaults.children}
      <button type="submit" class="button-accent">{propsWithDefaults.submitLabel}</button>
    </form>
  )
}
