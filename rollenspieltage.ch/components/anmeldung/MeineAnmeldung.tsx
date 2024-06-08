import { Box } from "@common/components/Box";
import { Show, onMount, type JSX } from "solid-js";
import { Tabs } from "./Tabs";
import { initState } from "./store";

export function MeineAnmeldung(): JSX.Element {
  const { store, actions } = initState();

  onMount(async () => {
    await actions.initMeineAnmeldung();
  });

  return (
    <>
      {store.state === "ERROR" ? (
        <Box type="danger">{store.message}</Box>
      ) : store.state === "LOADING" ? (
        <Box>
          <p>Deine Anmeldung wird geladen.</p>
        </Box>
      ) : (
        <>
          <Show when={store.showCreateMessage}>
            <Box type="success">
              Deine Anmeldung wurde erfolgreich gestartet.
              <br />
              <br />
              Wir haben eine E-Mail an deine Adresse gesendet. In dieser E-Mail
              findest du einen persönlichen Link, um deine Anmeldung bis kurz
              vor dem Anlass anzupassen.
            </Box>
            <br />
          </Show>
          <Tabs
            activeTab={store.activeTab}
            changeTab={actions.changeTab}
            save={store.currentSave}
            updateSave={actions.updateSave}
            lastSaved={store.lastSaved}
            saveCurrentState={actions.saveCurrentState}
            saveState={
              store.state === "SAVING"
                ? "SAVING"
                : store.hasChanged
                  ? "HAS_CHANGES"
                  : "NO_CHANGES"
            }
            program={store.program}
            confirmedReservations={store.currentSave.games}
            tentativeReservations={store.tentativeReservations}
            addTentativeReservation={actions.addTentativeReservation}
            deleteReservation={actions.deleteReservation}
            markedForDeletionReservations={store.markedForDeletionReservations}
          />
        </>
      )}
      <code>
        <pre>{JSON.stringify(store, null, 2)}</pre>
      </code>
    </>
  );
}
