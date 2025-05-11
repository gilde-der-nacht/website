import { Box } from "@common/components/Box";
import type { JSX } from "solid-js";

export function GamemasterPage(): JSX.Element {
  return (
    <div class="gamemaster">
      <h1>Meine Spielrunden</h1>
      <Box></Box>
    </div>
  );
}

export function NewGamePage(): JSX.Element {
  return <h1>NewGame Page</h1>;
}
