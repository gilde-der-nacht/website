import { For, type JSX } from "solid-js";

type RadioItem<T extends string> = {
  label: string;
  value: T;
  checked: boolean;
};

export type RadioGroupProps<T extends string> = {
  name: string;
  items: RadioItem<T>[];
  onValueUpdate: (value: T) => void;
};

export function RadioGroup<T extends string>(
  props: RadioGroupProps<T>,
): JSX.Element {
  return (
    <ul role="list" class="radio-list">
      <For each={props.items}>
        {(radio) => (
          <li>
            <Radio
              label={radio.label}
              name={radio.label}
              value={radio.value}
              checked={radio.checked}
              onValueUpdate={() => props.onValueUpdate(radio.value)}
            />
          </li>
        )}
      </For>
    </ul>
  );
}

type RadioProps<T extends string> = RadioItem<T> & {
  name: string;
  onValueUpdate: () => void;
};

export function Radio<T extends string>(props: RadioProps<T>): JSX.Element {
  return (
    <label class="input-radio">
      <input
        type="radio"
        name={props.name}
        value={props.value}
        checked={props.checked}
        onChange={props.onValueUpdate}
      />
      {props.label}
    </label>
  );
}
