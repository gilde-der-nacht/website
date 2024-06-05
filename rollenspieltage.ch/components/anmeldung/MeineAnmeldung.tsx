import { Box } from "@common/components/Box";
import { Show, onMount, type JSX } from "solid-js";
import { createStore } from "solid-js/store";
import {
  loadProgram,
  loadSave,
  type ProgramEntry,
  type ReservedEntry,
  type Save,
} from "./data";
import { Tabs, type Tab } from "./Tabs";

type Store =
  | {
      state: "IDLE" | "SAVING";
      secret: string;
      showCreateMessage: boolean;
      lastSave: Save;
      currentSave: Save;
      activeTab: Tab;
      lastSaved: string;
      hasChanged: boolean;
      program: null | {
        gameList: ProgramEntry[];
        reservedList: ReservedEntry[];
      };
      tentativeReservations: { gameUuid: string; friendsName: string | null }[];
    }
  | {
      state: "LOADING";
    }
  | {
      state: "ERROR";
      message: JSX.Element;
    };

export function MeineAnmeldung(): JSX.Element {
  const [store, setStore] = createStore<Store>({
    state: "LOADING",
  });

  function onAssertionFailed(): Store {
    return {
      state: "ERROR",
      message: (
        <p>
          Leider ist ein unerwarteter Fehler passiert. Versuche deine Anmeldung
          erneut zu laden. Wiederholt sich dieser Fehler, bitte kontaktiere uns
          sobald als möglich über das <a href="/kontatk">Kontaktformular</a>, da
          dies nicht passieren sollte.
        </p>
      ),
    } satisfies Store;
  }

  function changeTab(tab: Tab): void {
    setStore((prev) => {
      if (prev.state !== "IDLE" && prev.state !== "SAVING") {
        return onAssertionFailed();
      }
      return { ...prev, activeTab: tab };
    });
  }

  function updateSave<T extends keyof Save>(prop: T, value: Save[T]): void {
    setStore((prev) => {
      if (prev.state !== "IDLE" && prev.state !== "SAVING") {
        return onAssertionFailed();
      }
      return {
        ...prev,
        currentSave: { ...prev.currentSave, [prop]: value },
        hasChanged: true,
      };
    });
  }

  async function saveCurrentState(): Promise<void> {
    if (store.state !== "IDLE") {
      setStore(onAssertionFailed());
      return;
    }

    setStore("state", "SAVING");

    const saveUrl = new URL("https://elysium.gildedernacht.ch/rst24/save");
    const body = {
      ...store.currentSave,
    };
    const response = await fetch(saveUrl, {
      method: "post",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      setStore((prev) => {
        if (prev.state !== "SAVING") {
          return onAssertionFailed();
        }
        const now = new Date().toISOString();
        return { ...prev, state: "IDLE", hasChanged: false, lastSaved: now };
      });
    } else {
      setStore(onAssertionFailed());
    }
  }

  function onFailed(): void {
    setStore({
      state: "ERROR",
      message: (
        <p>
          Wir konnten leider keine Anmeldung finden. Wenn du bereits eine
          Anmeldung begonnen hast, solltest du den korrekten Link per E-Mail
          erhalten haben.
          <br />
          <br /> Falls du noch keine Anmeldung begonnen hast, kannst du{" "}
          <a href="/anmeldung">hier</a> deine persönliche Anmeldung beginnen.{" "}
          <br />
          <br />
          Für generelle Fragen oder Probleme, schreibe uns doch bitte über unser{" "}
          <a href="/kontatk">Kontaktformular</a>.
        </p>
      ),
    } satisfies Store);
  }

  onMount(async () => {
    const currentUrl = new URL(location.href);
    const secret = currentUrl.searchParams.get("secret");
    const showCreateMessage =
      currentUrl.searchParams.get("showCreateMessage") === "true";

    if (secret === null) {
      onFailed();
      return;
    }

    const result = await loadSave(secret);
    const loadProgramPromise = loadProgram();

    if (result.kind === "FAILED") {
      onFailed();
      return;
    }

    setStore({
      state: "IDLE",
      secret,
      showCreateMessage,
      lastSave: { ...result.save },
      currentSave: result.save,
      activeTab: "Contact",
      lastSaved: result.save.lastSaved,
      hasChanged: false,
      program: null,
      tentativeReservations: [],
    } satisfies Store);

    loadProgramPromise.then((result) => {
      if (result.kind === "FAILED") {
        onFailed();
        return;
      }

      setStore((prev) => {
        if (prev.state !== "IDLE" && prev.state !== "SAVING") {
          return onAssertionFailed();
        }
        return {
          ...prev,
          program: result.program,
        };
      });
    });

    currentUrl.searchParams.delete("showCreateMessage");
    history.replaceState({}, document.title, currentUrl);
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
            changeTab={changeTab}
            save={store.currentSave}
            updateSave={updateSave}
            lastSaved={store.lastSaved}
            saveCurrentState={saveCurrentState}
            saveState={
              store.state === "SAVING"
                ? "SAVING"
                : store.hasChanged
                  ? "HAS_CHANGES"
                  : "NO_CHANGES"
            }
            program={store.program}
          />
        </>
      )}
      <code>
        <pre>{JSON.stringify(store, null, 2)}</pre>
      </code>
    </>
  );
}
