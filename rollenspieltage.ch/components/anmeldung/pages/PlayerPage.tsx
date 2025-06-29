import { Box } from "@common/components/Box";
import { Match, Switch, type JSX } from "solid-js";

export function PlayerPage(props: { isDebugging: boolean }): JSX.Element {
  return (
    <Switch
      fallback={
        <Box type="danger">
          <p>
            Diese Seite ist leider noch nicht bereit. Komm bitte später nochmal
            zurück.
          </p>
        </Box>
      }
    >
      <Match when={props.isDebugging}>
        <Box type="danger">
          <p>WIP</p>
        </Box>
      </Match>
    </Switch>
  );
}
