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
import "../anmeldung.scss";
import {
  loadParams,
  loadServerProgram,
  loadServerState,
  type Params,
} from "../load";
import { Router } from "../Router";

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
  const [serverStateResource] = createResource(() =>
    loadServerState(props.params),
  );
  const [programResource] = createResource(() =>
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
          <Match when={serverStateResource()}>
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
