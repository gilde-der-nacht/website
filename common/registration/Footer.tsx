import type { JSX } from "@solidjs/web";
import type { ConnectionStatus } from "@registration/Connection";

export function Footer(props: {
  connectionStatus: ConnectionStatus;
}): JSX.Element {
  return <footer>{props.connectionStatus}</footer>;
}
