import type { JSX } from "solid-js";
import type { Tab } from "./Tabs";
import {
  loadProgram,
  loadSave,
  type ProgramEntry,
  type ReservedEntry,
  type Save,
} from "./data";
import { createStore } from "solid-js/store";

export type TentativeReservation = {
  gameUuid: string;
  friendsName: string | null;
};

export type Store =
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
      tentativeReservations: TentativeReservation[];
    }
  | {
      state: "LOADING";
    }
  | {
      state: "ERROR";
      message: JSX.Element;
    };

function onAssertionFailed(): Store {
  return {
    state: "ERROR",
    message: (
      <p>
        Leider ist ein unerwarteter Fehler passiert. Versuche deine Anmeldung
        erneut zu laden. Wiederholt sich dieser Fehler, bitte kontaktiere uns
        sobald als möglich über das <a href="/kontakt">Kontaktformular</a>, da
        dies nicht passieren sollte.
      </p>
    ),
  } satisfies Store;
}

export function initState() {
  const [store, setStore] = createStore<Store>({
    state: "LOADING",
  });
  return {
    store,
    actions: {
      changeTab(tab: Tab): void {
        setStore((prev) => {
          if (prev.state !== "IDLE" && prev.state !== "SAVING") {
            return onAssertionFailed();
          }
          return { ...prev, activeTab: tab };
        });
      },
      updateSave<T extends keyof Save>(prop: T, value: Save[T]): void {
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
      },
      async saveCurrentState(): Promise<void> {
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
            return {
              ...prev,
              state: "IDLE",
              hasChanged: false,
              lastSaved: now,
            };
          });
        } else {
          setStore(onAssertionFailed());
        }
      },
      onFailed(): void {
        setStore({
          state: "ERROR",
          message: (
            <p>
              Wir konnten leider keine Anmeldung finden. Wenn du bereits eine
              Anmeldung begonnen hast, solltest du den korrekten Link per E-Mail
              erhalten haben.
              <br />
              <br /> Falls du noch keine Anmeldung begonnen hast, kannst du{" "}
              <a href="/anmeldung">hier</a> deine persönliche Anmeldung
              beginnen. <br />
              <br />
              Für generelle Fragen oder Probleme, schreibe uns doch bitte über
              unser <a href="/kontatk">Kontaktformular</a>.
            </p>
          ),
        } satisfies Store);
      },
      async initMeineAnmeldung(): Promise<void> {
        const currentUrl = new URL(location.href);
        const secret = currentUrl.searchParams.get("secret");
        const showCreateMessage =
          currentUrl.searchParams.get("showCreateMessage") === "true";

        if (secret === null) {
          this.onFailed();
          return;
        }

        const result = await loadSave(secret);
        const loadProgramPromise = loadProgram();

        if (result.kind === "FAILED") {
          this.onFailed();
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
            this.onFailed();
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
      },
      addTentativeReservation(tentativeReservation: TentativeReservation) {
        setStore((prev) => {
          if (prev.state !== "IDLE" && prev.state !== "SAVING") {
            return onAssertionFailed();
          }
          return {
            ...prev,
            hasChanged: true,
            tentativeReservations: [
              ...prev.tentativeReservations,
              tentativeReservation,
            ],
          };
        });
      },
    },
  };
}
