import type { JSX } from "solid-js";
import type { ConnectionStatus } from "@registration/Connection";

export function Footer(props: {
  connectionStatus: ConnectionStatus;
}): JSX.Element {
  return <footer>{props.connectionStatus}</footer>;
}
