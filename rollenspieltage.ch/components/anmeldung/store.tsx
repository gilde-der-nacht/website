import type { JSX } from "solid-js";
import type { Tab } from "./Tabs";
import {
  loadProgram,
  loadSave,
  type ProgramEntry,
  type ReservationToServer,
  type ReservedEntry,
  type SaveFromServer,
  type SaveToServer,
} from "./data";
import { createStore } from "solid-js/store";

export type Reservation = {
  gameUuid: string;
  friendsName: string | null;
};

export type Store =
  | {
      state: "IDLE" | "SAVING";
      secret: string;
      showCreateMessage: boolean;
      currentSave: SaveFromServer;
      activeTab: Tab;
      lastSaved: string;
      hasChanged: boolean;
      program: null | {
        gameList: ProgramEntry[];
        reservedList: ReservedEntry[];
      };
      tentativeReservations: Reservation[];
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

  async function initMeineAnmeldung(): Promise<void> {
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
    window.scrollTo({ top: 0 });
  }

  function changeTab(tab: Tab): void {
    setStore((prev) => {
      if (prev.state !== "IDLE" && prev.state !== "SAVING") {
        return onAssertionFailed();
      }
      return { ...prev, activeTab: tab };
    });
    window.scrollTo({ top: 0 });
  }

  function updateSave<T extends keyof SaveFromServer>(
    prop: T,
    value: SaveFromServer[T],
  ): void {
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
      games: [
        ...store.currentSave.games,
        ...store.tentativeReservations.map((reservation) => {
          if (reservation.friendsName === null) {
            return {
              game: reservation.gameUuid,
              self: true,
              spielerName: null,
            } satisfies ReservationToServer;
          }
          return {
            game: reservation.gameUuid,
            self: false,
            spielerName: reservation.friendsName,
          } satisfies ReservationToServer;
        }),
      ],
    } satisfies SaveToServer;
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
        return {
          ...prev,
          tentativeReservations: [],
        };
      });
      await initMeineAnmeldung();
    } else {
      setStore(onAssertionFailed());
    }
  }

  function addTentativeReservation(tentativeReservation: Reservation) {
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
  }

  return {
    store,
    actions: {
      changeTab,
      updateSave,
      saveCurrentState,
      onFailed,
      initMeineAnmeldung,
      addTentativeReservation,
    },
  };
}
