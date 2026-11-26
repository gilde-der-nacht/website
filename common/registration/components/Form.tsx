import type { Reactive } from "@common/utils/reactivity";
import { type JSX } from "solid-js";
import type { FormField } from "@registration/state/form";

export function TextInputField(props: {
  field$: Reactive<FormField<string, string>>;
  type?: "text" | "date" | "email" | "tel" | undefined;
}): JSX.Element {
  return (
    <>
      <input
        type={props.type}
        value={props.field$.sub("formState").get()}
        onInput={(e) =>
          props.field$.sub("formState").set(e.currentTarget.value)
        }
      />
      <span>Remote: "{props.field$.get().remote}"</span> |{" "}
      <span>Valid: {props.field$.get().validated.status}</span>
    </>
  );
}
