import { Box } from "@common/components/Box";
import {
  ErrorBoundary,
  Match,
  Show,
  Suspense,
  Switch,
  createResource,
  createSignal,
  onMount,
  type JSX,
  type Resource,
} from "solid-js";

import { initState } from "@rst/components/anmeldung/store";
import {
  getPage,
  loadParams,
  loadServerProgram,
  loadServerState,
  type Params,
} from "@rst/components/anmeldung/load";
import type { Store } from "@rst/components/anmeldung/types";
import type { Program } from "@rst/components/anmeldung/data";
import { TXT } from "@rst/components/anmeldung/text";
import "../anmeldung.scss";

function Loading(): JSX.Element {
  return (
    <Box>
      <p>Deine Anmeldung wird geladen...</p>
    </Box>
  );
}

export function MeineAnmeldungWrapper(): JSX.Element {
  const [params, setParams] = createSignal<Params | null>(null);

  onMount(() => {
    setParams(loadParams());
  });

  return (
    <Switch fallback={<Loading />}>
      <Match when={params()}>
        {(state) => <MeineAnmeldung params={state()} />}
      </Match>
    </Switch>
  );
}

function MeineAnmeldung(props: { params: Params }): JSX.Element {
  const [serverState] = createResource(() => loadServerState(props.params));
  const [program] = createResource(() =>
    loadServerProgram(props.params.secret === "demo"),
  );

  return (
    <ErrorBoundary
      fallback={(err) => (
        <Box type="danger">
          <Switch
            fallback={
              <p>
                Leider ist ein unerwarteter Fehler passiert. Versuche deine
                Anmeldung erneut zu laden. Wiederholt sich dieser Fehler, bitte
                kontaktiere uns sobald als möglich über das{" "}
                <a href="/kontakt">Kontaktformular</a>, da dies nicht passieren
                sollte.
              </p>
            }
          >
            <Match when={err.message === "SECRET_ERROR"}>
              <p>
                Wir konnten leider keine Anmeldung finden. Wenn du bereits eine
                Anmeldung begonnen hast, solltest du den korrekten Link per
                E-Mail erhalten haben.
                <br />
                <br /> Falls du noch keine Anmeldung begonnen hast, kannst du{" "}
                <a href="/anmeldung">hier</a> deine persönliche Anmeldung
                beginnen. <br />
                <br />
                Für generelle Fragen oder Probleme, schreibe uns doch bitte über
                unser <a href="/kontatk">Kontaktformular</a>.
              </p>
            </Match>
          </Switch>
        </Box>
      )}
    >
      <Suspense fallback={<Loading />}>
        <Switch>
          <Match when={serverState()}>
            {(state) => (
              <MeineAnmeldungLoaded state={state()} programResource={program} />
            )}
          </Match>
        </Switch>
      </Suspense>
    </ErrorBoundary>
  );
}

function MeineAnmeldungLoaded(props: {
  state: Store;
  programResource: Resource<Program>;
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
      <Switch>
        <Match when={state.page === "CHOOSE"}>
          <div class="choose">
            <Box>
              <div class="grid">
                <i class="fa-duotone fa-dice-d20"></i>
                <div>
                  <h3>Spielrunden ansehen</h3>
                  <p>
                    Melde dich (und deine Freunde) für diverse Spielrunden an.
                  </p>
                </div>
              </div>
            </Box>
            <br />
            <Box>
              <div class="grid">
                <i class="fa-duotone fa-grid-2-plus"></i>
                <div>
                  <h3>Spielrunden erstellen</h3>
                  <p>
                    Falls du wenig oder gar keine Erfahrung als Spielleiter:in
                    hast, werden wir dich vor und während dem Anlass
                    unterstützen.
                  </p>
                </div>
              </div>
            </Box>
            <br />
            <Box>
              <div class="grid">
                <i class="fa-duotone fa-hand-heart"></i>
                <div>
                  <h3>Helfen</h3>
                  <p>
                    Beim Kiosk und der Essensausgabe können wir immer ein paar
                    helfende Hände gebrauchen.
                  </p>
                </div>
              </div>
            </Box>
          </div>
        </Match>
        <Match when={state.page === "OVERVIEW"}>
          <h1>Overview</h1>
        </Match>
      </Switch>
    </>
  );
}
