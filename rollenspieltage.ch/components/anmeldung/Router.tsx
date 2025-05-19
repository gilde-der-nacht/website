import type { Store } from "solid-js/store";
import type { AppState } from "./types";
import { Match, Show, Switch, type JSX } from "solid-js";
import type { Program } from "./data";
import { initState } from "./store";
import { getPage } from "./load";
import { SummaryPage } from "./pages/SummaryPage";
import { HelpingPage } from "./pages/HelpingPage";
import { NewGamePage } from "./pages/GameroundEdit";
import { GamemasterPage } from "./pages/Gamemaster";
import { PlayerPage } from "./pages/PlayerPage";
import { Box } from "@common/components/Box";
import { TXT } from "./text";
import { ChoosePage } from "./pages/Choose";

export function Router(props: {
  state: Store<AppState>;
  programResource: Program;
}): JSX.Element {
  const { state, actions } = initState(props.state);

  window.addEventListener("popstate", (e: unknown) => {
    if (typeof e === "object" && e !== null && "state" in e) {
      const currentUrl = new URL(location.href);
      const page = getPage(currentUrl);
      actions.changePage(page, true);
    }
  });

  return (
    <>
      <Show when={state.showCreateMessage}>
        <Box type="success">{TXT.registrationStarted}</Box>
        <br />
      </Show>
      <Switch fallback={<ChoosePage changePage={actions.changePage} />}>
        <Match when={state.page === "PLAYER"}>
          <PlayerPage changePage={actions.changePage} />
        </Match>
        <Match when={state.page === "GAMEMASTER"}>
          <GamemasterPage
            store={state.currentSave.gameMaster}
            changePage={actions.changePage}
          />
        </Match>
        <Match when={state.page === "GAMEMASTER_NEW"}>
          <NewGamePage
            store={state.gameRoundEdit}
            changePage={actions.changePage}
            openingHours={props.programResource.openingHours}
            createNewGame={actions.createNewGame}
          />
        </Match>
        <Match when={state.page === "HELPING"}>
          <HelpingPage changePage={actions.changePage} />
        </Match>
        <Match when={state.page === "SUMMARY"}>
          <SummaryPage changePage={actions.changePage} />
        </Match>
      </Switch>
      <pre>{JSON.stringify(state, null, 2)}</pre>
    </>
  );
}
