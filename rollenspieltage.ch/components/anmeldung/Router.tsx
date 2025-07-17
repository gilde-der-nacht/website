import {
  createResource,
  createSignal,
  Match,
  onMount,
  Show,
  Suspense,
  Switch,
  type JSX,
} from "solid-js";
import { SummaryPage } from "@rst/components/anmeldung/pages/SummaryPage";
import { HelpingPage } from "@rst/components/anmeldung/pages/HelpingPage";
import { GamemasterPage } from "@rst/components/anmeldung/pages/GamemasterPage";
import { PlayerPage } from "@rst/components/anmeldung/pages/PlayerPage";
import { Box } from "@common/components/Box";
import { TXT } from "@rst/components/anmeldung/constant/texts";
import { ChoosePage } from "@rst/components/anmeldung/pages/ChoosePage";
import {
  EditGamePage,
  FindGameround,
} from "@rst/components/anmeldung/pages/EditGamePage";
import {
  getMetaState,
  isSamePage,
  type MetaClient,
  type PageClient,
  type PageClientSimplified,
} from "@rst/components/anmeldung/api/meta";
import {
  debouncedSaveState,
  type SaveClient,
} from "@rst/components/anmeldung/api/save";
import { createStore, unwrap, type Store } from "solid-js/store";
import { PageTemplate } from "@rst/components/anmeldung/pages/PageTemplate";
import { loadReservations } from "@rst/components/anmeldung/api/reservations";
import { loadProgram } from "@rst/components/anmeldung/api/program";
import { createQueue } from "@common/components/utils";
import type { EmailQueueableFns } from "@rst/components/anmeldung/api/email";
import { toast, ToastContainer } from "@common/components/Toast";

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

export type ChangePageFn = (
  page: PageClientSimplified,
  opts?: {
    backButton?: boolean;
    disableScroll?: boolean;
  },
) => void;
function createChangePageFn(store: Store<{ page: PageClient }>): ChangePageFn {
  const [pageStore, setPageStore] = createStore(store.page);
  return (
    page: PageClientSimplified,
    opts?: {
      backButton?: boolean;
      disableScroll?: boolean;
    },
  ) => {
    if (isSamePage(page, pageStore)) {
      return;
    }

    const backButton = opts?.backButton ?? false;
    const disableScroll = opts?.disableScroll ?? false;

    const url = new URL(location.href);
    url.searchParams.set("page", page.kind.toLowerCase());
    if (page.kind === "EDIT_GAMEROUND") {
      url.searchParams.set("uuid", page.uuid);
      setPageStore(page);
    } else if (page.kind === "GAME") {
      url.searchParams.set("uuid", page.uuid);
      setPageStore(page);
    } else {
      url.searchParams.delete("uuid");
      setPageStore({ ...page, uuid: null });
    }
    if (!backButton) {
      history.pushState({ page }, "", url);
    }
    const newMetaTitle = TXT.pageTitle[page.kind];
    document.title = TXT.metaTitle.replace("{}", newMetaTitle);
    if (!disableScroll) {
      window.scrollTo({ top: 0 });
    }
  };
}

export function Router(props: {
  meta: MetaClient;
  save: SaveClient;
}): JSX.Element {
  initPage(props.meta);
  const [store, setStore] = createStore({
    meta: props.meta,
    save: props.save,
  });

  const slotUuids = () =>
    store.save.master.games.flatMap((game) =>
      game.slots.map((slot) => slot.uuid),
    );

  const [reservationsResource] = createResource(slotUuids(), (uuids) =>
    loadReservations(store.meta.secret, uuids),
  );

  const [programResource] = createResource(() =>
    loadProgram(store.meta.secret),
  );

  const deactivateToastUuid = crypto.randomUUID();
  // hacky solution to not save on first load when nothing has changed yet.
  const [run, setRun] = createSignal(false);
  createResource(
    () => JSON.stringify(store.save),
    async () => {
      if (!run()) {
        setRun(true);
        return;
      }

      if (store.save.publishState !== "published") {
        toast(
          "Diese Anmeldung wurde deaktiviert und kann nicht editiert werden.",
          { kind: "danger", uuid: deactivateToastUuid },
        );
        return;
      }

      const newState = unwrap(store.save);

      try {
        const saveResult = await debouncedSaveState(
          store.meta,
          newState,
          store.meta.secret,
        );
        if (saveResult.kind === "FAILURE") {
          console.error(saveResult);
        } else {
          setStore("save", "lastSaved", saveResult.data);
        }
      } catch (e) {
        console.error(e);
        setStore("meta", "saveState", "ERROR");
      }
    },
  );

  const changePage = createChangePageFn(store.meta);
  const queue = createQueue<EmailQueueableFns>();

  onMount(() => {
    window.addEventListener("popstate", (e: unknown) => {
      if (typeof e === "object" && e !== null && "state" in e) {
        const currentUrl = new URL(location.href);
        const meta = getMetaState(currentUrl);
        changePage(meta.page, { backButton: true });
      }
    });

    setInterval(async () => {
      const next = queue.dequeue();
      if (next.kind === "NEXT_ELEMENT") {
        await next.data();
      }
    }, 1_000);
  });

  return (
    <>
      <Show when={store.meta.showCreateMessage}>
        <Box type="success">{TXT.registrationStarted}</Box>
        <br />
      </Show>
      <Show when={store.save.publishState !== "published"}>
        <Box type="danger">
          Diese Anmeldung wurde deaktiviert. Sollte dies ein Fehler sein,
          kontaktiere uns bitte.
        </Box>
        <br />
      </Show>
      <Switch
        fallback={
          <PageTemplate
            title="Wo möchtest du starten?"
            showQuickmenu={false}
            changePage={changePage}
            saveState={store.meta.saveState}
            lastSaved={store.save.lastSaved}
          >
            <ChoosePage
              changePage={changePage}
              saveState={store.meta.saveState}
              lastSaved={store.save.lastSaved}
            />
          </PageTemplate>
        }
      >
        <Match
          when={
            store.meta.page.kind === "PLAYER" || store.meta.page.kind === "GAME"
          }
        >
          <PageTemplate
            title="Spielrundenübersicht"
            changePage={changePage}
            saveState={store.meta.saveState}
            lastSaved={store.save.lastSaved}
          >
            <PlayerPage
              store={store.save.playing}
              program={programResource}
              uuid={
                store.meta.page.kind === "GAME" ? store.meta.page.uuid : null
              }
              isEditable={store.save.publishState === "published"}
              changePage={changePage}
            />
          </PageTemplate>
        </Match>
        <Match when={store.meta.page.kind === "GAMEMASTER"}>
          <PageTemplate
            title="Meine Spielrunden"
            changePage={changePage}
            saveState={store.meta.saveState}
            lastSaved={store.save.lastSaved}
          >
            <GamemasterPage
              store={store.save.master}
              isEditable={store.save.publishState === "published"}
              changePage={changePage}
            />
          </PageTemplate>
        </Match>
        <Match when={store.meta.page.kind === "EDIT_GAMEROUND"}>
          <PageTemplate
            title="Spielrunde editieren"
            changePage={changePage}
            saveState={store.meta.saveState}
            lastSaved={store.save.lastSaved}
          >
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
                <EditGamePage
                  store={gameround}
                  registrations={reservationsResource}
                  queue={queue}
                  isEditable={store.save.publishState === "published"}
                  changePage={changePage}
                  secret={store.meta.secret}
                />
              )}
            </FindGameround>
          </PageTemplate>
        </Match>
        <Match when={store.meta.page.kind === "HELPING"}>
          <PageTemplate
            title="Helfen"
            changePage={changePage}
            saveState={store.meta.saveState}
            lastSaved={store.save.lastSaved}
          >
            <HelpingPage />
          </PageTemplate>
        </Match>
        <Match when={store.meta.page.kind === "SUMMARY"}>
          <PageTemplate
            title="Zusammenfassung"
            changePage={changePage}
            saveState={store.meta.saveState}
            lastSaved={store.save.lastSaved}
          >
            <SummaryPage
              store={store.save}
              program={programResource}
              isEditable={store.save.publishState === "published"}
              changePage={changePage}
            />
          </PageTemplate>
        </Match>
      </Switch>
      <Show when={store.meta.isDebugging}>
        <pre>{JSON.stringify(store, null, 2)}</pre>
        <hr />
        <div>
          <code>Reservations (read-only)</code>
        </div>
        <Suspense fallback={<em>loading...</em>}>
          <Show when={reservationsResource()}>
            {(r) => <pre>{JSON.stringify(r(), null, 2)}</pre>}
          </Show>
        </Suspense>
      </Show>
      <ToastContainer />
    </>
  );
}
