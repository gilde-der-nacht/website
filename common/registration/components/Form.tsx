import type { Reactive } from "@common/utils/reactivity";
import type { JSX } from "@solidjs/web";

export function TextInputField(props: {
  value$: Reactive<string>;
  type?: "text" | "date" | "email" | "tel" | undefined;
}): JSX.Element {
  return (
    <input
      type={props.type}
      value={props.value$.get()}
      onInput={(e) => props.value$.set(e.currentTarget.value)}
    />
  );
}
