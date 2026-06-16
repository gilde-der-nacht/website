import { createSignal, type JSX } from "solid-js";
import { ButtonWithIcon } from "@common/components/Button";

export function InputButton(props: {
  label: string;
  addFriend: (name: string) => void;
  disabled?: boolean;
}): JSX.Element {
  const [name, setName] = createSignal("");
  return (
    <form
      novalidate={true}
      style="display: grid; gap: 0rem; grid-template-columns: 1fr max-content"
      class="input-button"
      onSubmit={(e: SubmitEvent) => {
        e.preventDefault();
        const n = name();
        if (n.trim().length > 0) {
          props.addFriend(n);
        }
      }}
    >
      <input
        type="text"
        style="border-color: var(--clr-special-9);"
        value={name()}
        onInput={(e) => setName(e.target.value)}
        disabled={props.disabled === true}
      />
      <ButtonWithIcon
        icon="arrow-right"
        type="submit"
        label={props.label}
        kind="special"
        disabled={props.disabled === true}
      />
    </form>
  );
}
