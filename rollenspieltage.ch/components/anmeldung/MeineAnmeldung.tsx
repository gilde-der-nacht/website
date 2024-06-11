import { Box } from "@common/components/Box";
import {
  ErrorBoundary,
  Match,
  Show,
  Suspense,
  Switch,
  createResource,
  type JSX,
  type Resource,
} from "solid-js";
import { Tabs } from "./Tabs";
import { initState } from "./store";
import {
  loadParams as loadParams,
  loadServerProgram,
  loadServerState,
} from "./load";
import type { Store } from "./types";
import type { Program } from "./data";

function MeineAnmeldungLoaded(props: {
  state: Store;
  programResource: Resource<Program>;
}): JSX.Element {
  const { state, actions } = initState(props.state);
  return (
    <>
      <Show when={state.showCreateMessage}>
        <Box type="success">
          Deine Anmeldung wurde erfolgreich gestartet.
          <br />
          <br />
          Wir haben eine E-Mail an deine Adresse gesendet. In dieser E-Mail
          findest du einen persönlichen Link, um deine Anmeldung bis am{" "}
          <strong>Freitag, 23. August 2024</strong> anzupassen.
        </Box>
        <br />
      </Show>
      <Tabs
        activeTab={state.activeTab}
        changeTab={actions.changeTab}
        save={state.currentSave}
        updateSave={actions.updateSave}
        lastSaved={state.lastSaved}
        saveCurrentState={actions.saveCurrentState}
        saveState={
          state.state === "SAVING"
            ? "SAVING"
            : state.hasChanged
              ? "HAS_CHANGES"
              : "NO_CHANGES"
        }
        programResource={props.programResource}
        confirmedReservations={state.currentSave.games}
        tentativeReservations={state.tentativeReservations}
        addTentativeReservation={actions.addTentativeReservation}
        deleteReservation={actions.deleteReservation}
        markedForDeletionReservations={state.markedForDeletionReservations}
      />
    </>
  );
}

export function MeineAnmeldung(): JSX.Element {
  const params = loadParams();
  const [serverState] = createResource(() => loadServerState(params));
  const [program] = createResource(() => loadServerProgram());

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
      <Suspense
        fallback={
          <Box>
            <p>Deine Anmeldung wird geladen...</p>
          </Box>
        }
      >
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
