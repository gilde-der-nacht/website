import type { JSX } from "@solidjs/web";

type Props = {
  name: string;
  value: string;
};

export function HiddenInput(props: Props): JSX.Element {
  return <input type="hidden" name={props.name} value={props.value} />;
}
