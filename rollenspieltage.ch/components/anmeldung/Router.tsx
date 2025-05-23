import { Match, Show, Switch, type JSX, type Resource } from "solid-js";
import { SummaryPage } from "@rst/components/anmeldung/pages/SummaryPage";
import { HelpingPage } from "@rst/components/anmeldung/pages/HelpingPage";
import { GamemasterPage } from "@rst/components/anmeldung/pages/Gamemaster";
import { PlayerPage } from "@rst/components/anmeldung/pages/PlayerPage";
import { Box } from "@common/components/Box";
import { TXT } from "@rst/components/anmeldung/constant/texts";
import { ChoosePage } from "@rst/components/anmeldung/pages/Choose";
import { NewGamePage } from "@rst/components/anmeldung/pages/NewGamePage";
import { EditGamePage } from "@rst/components/anmeldung/pages/EditGamePage";
import type { PublicProgramClient } from "@rst/components/anmeldung/api/program";
import type { Result } from "@rst/components/anmeldung/api/utils";
import {
  getMetaState,
  isSamePage,
  type MetaClient,
  type PageClient,
} from "@rst/components/anmeldung/api/meta";
import type { SaveClient } from "@rst/components/anmeldung/api/save";
import { createStore, type Store } from "solid-js/store";

function initPage(page: MetaClient): void {
  const { kind } = page;
  const url = new URL(location.href);
  url.searchParams.set("page", kind.toLowerCase());
  if (kind === "EDIT_GAMEROUND") {
    url.searchParams.set("uuid", page.uuid);
  }
  url.searchParams.delete("showCreateMessage");
  history.replaceState({ page }, "", url);
  const newMetaTitle = TXT.pageTitle[kind];
  document.title = TXT.metaTitle.replace("{}", newMetaTitle);
}

export type ChangePageFn = (page: PageClient, backButton?: boolean) => void;
function createChangePageFn(store: Store<{ page: PageClient }>): ChangePageFn {
  const [pageStore, setPageStore] = createStore(store.page);
  return (page: PageClient, backButton?: boolean) => {
    if (isSamePage(page, pageStore)) {
      return;
    }

    if (!backButton) {
      const url = new URL(location.href);
      url.searchParams.set("page", page.kind.toLowerCase());
      if (page.kind === "EDIT_GAMEROUND") {
        url.searchParams.set("uuid", page.uuid);
      }
      history.pushState({ page }, "", url);
    }
    const newMetaTitle = TXT.pageTitle[page.kind];
    document.title = TXT.metaTitle.replace("{}", newMetaTitle);
    setPageStore(page);
    window.scrollTo({ top: 0 });
  };
}

export function Router(props: {
  page: MetaClient;
  save: SaveClient;
  programResource: Resource<Result<PublicProgramClient>>;
}): JSX.Element {
  initPage(props.page);
  const [store, _setStore] = createStore({
    page: props.page,
    save: props.save,
  });
  const changePage = createChangePageFn(store);

  window.addEventListener("popstate", (e: unknown) => {
    if (typeof e === "object" && e !== null && "state" in e) {
      const currentUrl = new URL(location.href);
      const pageMeta = getMetaState(currentUrl);
      changePage(pageMeta, true);
    }
  });

  return (
    <>
      <Show when={store.page.showCreateMessage}>
        <Box type="success">{TXT.registrationStarted}</Box>
        <br />
      </Show>
      <Switch fallback={<ChoosePage changePage={changePage} />}>
        <Match when={store.page.kind === "PLAYER"}>
          <PlayerPage changePage={changePage} />
        </Match>
        <Match when={store.page.kind === "GAMEMASTER"}>
          <GamemasterPage
            store={state.currentSave.gameMaster}
            changePage={changePage}
          />
        </Match>
        <Match when={store.page.kind === "NEW_GAMEROUND"}>
          <NewGamePage
            store={state.gameRoundEdit}
            changePage={changePage}
            openingHours={props.programResource.openingHours}
            createNewGame={createNewGame}
          />
        </Match>
        <Match when={store.page.kind === "EDIT_GAMEROUND"}>
          <EditGamePage
          // store={state.gameRoundEdit}
          // changePage={changePage}
          // openingHours={props.programResource.openingHours}
          // createNewGame={createNewGame}
          />
        </Match>
        <Match when={store.page.kind === "HELPING"}>
          <HelpingPage changePage={changePage} />
        </Match>
        <Match when={store.page.kind === "SUMMARY"}>
          <SummaryPage changePage={changePage} />
        </Match>
      </Switch>
      <pre>{JSON.stringify(store, null, 2)}</pre>
    </>
  );
}
