import { type JSX, For, mergeProps } from "solid-js";

type Props = {
  hasErrors?: boolean;
  entries: { label: string; value: string }[];
  updateValue: (value: string) => void;
};

export const Dropdown = (props: Props): JSX.Element => {
  const merged = mergeProps({ hasErrors: false }, props);

  const onChange = (e: Event) =>
    merged.updateValue((e.target as HTMLSelectElement).value);
  return (
    <div class="control">
      <div class="select" classList={{ "is-danger": props.hasErrors }}>
        <select onChange={onChange}>
          <For each={merged.entries}>
            {(entry) => <option value={entry.value}>{entry.label}</option>}
          </For>
        </select>
      </div>
    </div>
  );
};
