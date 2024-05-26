import { For, type JSX } from "solid-js";

type CheckboxItem<T extends string> = {
  label: string;
  name: string;
  value: T;
  checked: boolean;
}

export type CheckboxGroupProps<T extends string> = {
  items: CheckboxItem<T>[];
  onValueUpdate: (name: T, value: boolean) => void;
}

export function CheckboxGroup<T extends string>(props: CheckboxGroupProps<T>): JSX.Element {
  return (
    <ul role="list" class="checkbox-list">
      <For each={props.items}>
        {checkbox => (
          <li>
            <Checkbox
              label={checkbox.label}
              name={checkbox.name}
              value={checkbox.value}
              checked={checkbox.checked}
              onValueUpdate={(value) => props.onValueUpdate(checkbox.value, value)} />
          </li>
        )}
      </For>
    </ul>
  )
}

type CheckboxProps<T extends string> = CheckboxItem<T> & {
  onValueUpdate: (value: boolean) => void;
}

export function Checkbox<T extends string>(props: CheckboxProps<T>): JSX.Element {
  return (
    <label class="input-checkbox">
      <input
        type="checkbox"
        name={props.name}
        value={props.value}
        checked={props.checked}
        onChange={(e) => props.onValueUpdate(e.target.checked)} />
      {props.label}
    </label>
  )
}
