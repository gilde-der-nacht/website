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
} from "solid-js";
import "@rst/components/anmeldung/anmeldung.scss";
import { Router } from "@rst/components/anmeldung/Router";
import { loadSave } from "@rst/components/anmeldung/api/save";
import {
  getPageState,
  type PageState,
} from "@rst/components/anmeldung/state/page-client";

function Loading(): JSX.Element {
  return (
    <Box>
      <p>Deine Anmeldung wird geladen...</p>
    </Box>
  );
}

export function MeineAnmeldungWrapper(): JSX.Element {
  const [pageState, setPageState] = createSignal<PageState | null>(null);

  onMount(() => {
    const currentUrl = new URL(location.href);
    setPageState(getPageState(currentUrl));
  });

  return (
    <Show fallback={<Loading />} when={pageState()}>
      {(state) => <MeineAnmeldung pageState={state()} />}
    </Show>
  );
}

function MeineAnmeldung(props: { pageState: PageState }): JSX.Element {
  const [saveResource] = createResource(() => loadSave(props.pageState.secret));
  const [programResource] = createResource(() =>
    loadServerProgram(props.pageState.secret === "demo"),
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
          <Match when={saveResource()}>
            {(state) => (
              <Show when={programResource()}>
                {(program) => (
                  <Router state={state()} programResource={program()} />
                )}
              </Show>
            )}
          </Match>
        </Switch>
      </Suspense>
    </ErrorBoundary>
  );
}
