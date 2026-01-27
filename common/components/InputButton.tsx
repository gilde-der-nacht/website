import { createSignal, type JSX } from "solid-js";
import { ButtonWithIcon } from "@common/components/Button";

export function InputButton(props: {
  addFriend: (name: string) => void;
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
      />
      <ButtonWithIcon
        icon="arrow-right"
        type="submit"
        label="Begleitperson anmelden"
        kind="special"
      />
    </form>
  );
}
