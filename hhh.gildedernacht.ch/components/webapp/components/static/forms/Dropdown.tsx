import type { JSX } from "@solidjs/web";
import { For, merge } from "solid-js";

type Props = {
  hasErrors?: boolean;
  entries: { label: string; value: string }[];
  updateValue: (value: string) => void;
};

export const Dropdown = (props: Props): JSX.Element => {
  const merged = merge({ hasErrors: false }, props);

  const onChange = (e: Event) =>
    merged.updateValue((e.target as HTMLSelectElement).value);
  return (
    <div class="control">
      <div class={{ select: true, "is-danger": props.hasErrors }}>
        <select onChange={onChange}>
          <For each={merged.entries}>
            {(entry) => <option value={entry.value}>{entry.label}</option>}
          </For>
        </select>
      </div>
    </div>
  );
};
