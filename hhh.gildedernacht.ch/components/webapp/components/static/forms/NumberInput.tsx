import type { JSX } from "@solidjs/web";
import { merge, Show } from "solid-js";

type Props = {
  label: string;
  value: number;
  helptext: string;
  error?: { status: boolean; text?: string };
  setter?: (content: number) => void;
};

export const NumberInput = (props: Props): JSX.Element => {
  const merged = merge(
    {
      error: { status: false, text: "" },
      setter: () => {},
      id: `id-${Math.floor(Math.random() * 100)}`,
    },
    props,
  );

  return (
    <div class="field">
      <label class="label" for={merged.id}>
        {merged.label}
      </label>
      <div
        class={{
          control: true,
          "has-icons-right": merged.error.status,
        }}
      >
        <input
          id={merged.id}
          class={{
            input: true,
            "is-danger": merged.error.status,
          }}
          type="number"
          min={0}
          step={1}
          value={merged.value}
          onInput={(e) =>
            merged.setter(
              Math.floor(Number((e.target as HTMLInputElement).value)),
            )
          }
        />
        <Show when={merged.error.status}>
          <span class="icon is-small is-right">
            <i class="fas fa-exclamation-triangle"></i>
          </span>
        </Show>
      </div>
      <Show when={merged.error.status}>
        <p class="help is-danger">{merged.error.text}</p>
      </Show>
      <p class="help">{merged.helptext}</p>
    </div>
  );
};
