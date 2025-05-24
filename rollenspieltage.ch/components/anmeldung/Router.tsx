import { Match, Show, Switch, type JSX, type Resource } from "solid-js";
import { SummaryPage } from "@rst/components/anmeldung/pages/SummaryPage";
import { HelpingPage } from "@rst/components/anmeldung/pages/HelpingPage";
import { GamemasterPage } from "@rst/components/anmeldung/pages/GamemasterPage";
import { PlayerPage } from "@rst/components/anmeldung/pages/PlayerPage";
import { Box } from "@common/components/Box";
import { TXT } from "@rst/components/anmeldung/constant/texts";
import { ChoosePage } from "@rst/components/anmeldung/pages/ChoosePage";
import { NewGamePage } from "@rst/components/anmeldung/pages/NewGamePage";
import {
  EditGamePage,
  FindGameround,
} from "@rst/components/anmeldung/pages/EditGamePage";
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
import { createNewGame } from "@rst/components/anmeldung/utils/store";

function initPage(meta: Store<MetaClient>): void {
  const url = new URL(location.href);
  url.searchParams.set("page", meta.page.kind.toLowerCase());
  if (meta.page.kind === "EDIT_GAMEROUND") {
    url.searchParams.set("uuid", meta.page.uuid);
  }
  url.searchParams.delete("showCreateMessage");
  history.replaceState({ page: meta }, "", url);
  const newMetaTitle = TXT.pageTitle[meta.page.kind];
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
  meta: MetaClient;
  save: SaveClient;
  programResource: Resource<Result<PublicProgramClient>>;
}): JSX.Element {
  initPage(props.meta);
  const [store] = createStore({
    meta: props.meta,
    save: props.save,
  });
  const changePage = createChangePageFn(store.meta);

  window.addEventListener("popstate", (e: unknown) => {
    if (typeof e === "object" && e !== null && "state" in e) {
      const currentUrl = new URL(location.href);
      const meta = getMetaState(currentUrl);
      changePage(meta.page, true);
    }
  });

  return (
    <>
      <Show when={store.meta.showCreateMessage}>
        <Box type="success">{TXT.registrationStarted}</Box>
        <br />
      </Show>
      <Switch fallback={<ChoosePage changePage={changePage} />}>
        <Match when={store.meta.page.kind === "PLAYER"}>
          <PlayerPage changePage={changePage} />
        </Match>
        <Match when={store.meta.page.kind === "GAMEMASTER"}>
          <GamemasterPage store={store.save.master} changePage={changePage} />
        </Match>
        <Match when={store.meta.page.kind === "NEW_GAMEROUND"}>
          <NewGamePage
            store={store.save.master.newEditForm}
            changePage={changePage}
            createNewGame={() => createNewGame(store)}
          />
        </Match>
        <Match when={store.meta.page.kind === "EDIT_GAMEROUND"}>
          <FindGameround
            allRounds={store.save.master.games}
            uuid={
              store.meta.page.kind === "EDIT_GAMEROUND"
                ? store.meta.page.uuid
                : "should never happen"
            }
            fallback={<Box type="danger">{TXT.error.gameroundUuidError}</Box>}
          >
            {(gameround) => (
              <EditGamePage store={gameround} changePage={changePage} />
            )}
          </FindGameround>
        </Match>
        <Match when={store.meta.page.kind === "HELPING"}>
          <HelpingPage changePage={changePage} />
        </Match>
        <Match when={store.meta.page.kind === "SUMMARY"}>
          <SummaryPage changePage={changePage} />
        </Match>
      </Switch>
      <pre>{JSON.stringify(store, null, 2)}</pre>
    </>
  );
}
