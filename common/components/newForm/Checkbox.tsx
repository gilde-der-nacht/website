import type { Reactive } from "@common/utils/reactivity";
import { For, Show, type JSX } from "solid-js";

type CheckboxItem<T extends string> = {
  label: string | JSX.Element;
  description?: string | JSX.Element;
  name: string;
  value: T;
  checked$: Reactive<boolean>;
  disabled?: boolean | undefined;
  afterUpdate?: (() => void) | undefined;
};

export type CheckboxGroupProps<T extends string> = {
  items: CheckboxItem<T>[];
};

export function CheckboxGroup<T extends string>(
  props: CheckboxGroupProps<T>,
): JSX.Element {
  return (
    <ul role="list" class="checkbox-list">
      <For each={props.items}>
        {(checkbox) => (
          <li>
            <Checkbox
              label={checkbox.label}
              name={checkbox.name}
              value={checkbox.value}
              checked$={checkbox.checked$}
              disabled={checkbox.disabled}
              afterUpdate={checkbox.afterUpdate}
            />
          </li>
        )}
      </For>
    </ul>
  );
}

type CheckboxProps<T extends string> = CheckboxItem<T>;

export function Checkbox<T extends string>(
  props: CheckboxProps<T>,
): JSX.Element {
  return (
    <label class="input-checkbox">
      <input
        type="checkbox"
        name={props.name}
        value={props.value}
        checked={props.checked$.get()}
        onChange={(e) => {
          props.checked$.set(e.target.checked);
          props.afterUpdate?.();
        }}
        disabled={props.disabled === true}
      />
      <div>
        {props.label}
        <Show when={props.description}>
          {(description) => (
            <div class="checkbox-description">{description()}</div>
          )}
        </Show>
      </div>
    </label>
  );
}
