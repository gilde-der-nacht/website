import type { Tab } from "@rst/components/anmeldung/Tabs";
import {
  type ReservationToServer,
  type SaveFromServer,
  type SaveToServer,
  type UpdateSave,
} from "@rst/components/anmeldung/data";
import { createStore } from "solid-js/store";
import type {
  Reservation,
  ReservationView,
  AppState,
} from "@rst/components/anmeldung/types";
import {
  loadServerState,
  MetaTitle,
  type PageMeta,
} from "@rst/components/anmeldung/load";
import { elysium } from "@common/components/utils";
import {
  gameRoundDefault,
  gameRoundEditErrorsDefault,
} from "./utils/gameRound";

type Actions = {
  changePage: (pageMeta: PageMeta, backButton?: boolean) => void;
  createNewGame: () => void;
  // old actions
  changeTab: (tab: Tab) => void;
  updateSave: UpdateSave;
  saveCurrentState: () => Promise<void>;
  addTentativeReservation: (tentativeReservation: Reservation) => void;
  deleteReservation: (reservation: ReservationView) => void;
};

export function initState(init: AppState): {
  state: AppState;
  actions: Actions;
} {
  const [store, setStore] = createStore(init);

  function changeTab(tab: Tab): void {
    setStore("activeTab", tab);
    window.scrollTo({ top: 0 });
  }

  function initPage(pageMeta: PageMeta): void {
    const [page, uuid] = pageMeta;
    const url = new URL(location.href);
    url.searchParams.set("page", page.toLowerCase());
    if (uuid !== undefined) {
      url.searchParams.set("uuid", uuid);
    }
    url.searchParams.delete("showCreateMessage");
    history.replaceState({ pageMeta }, "", url);
    const newMetaTitle = MetaTitle[page];
    document.title = `Meine Anmeldung: ${newMetaTitle} | Luzerner Rollenspieltage `;
  }
  initPage(init.pageMeta);

  function changePage(pageMeta: PageMeta, backButton?: boolean): void {
    if (
      pageMeta[0] === store.pageMeta[0] &&
      pageMeta[1] === store.pageMeta[1]
    ) {
      return;
    }

    const [page, uuid] = pageMeta;

    if (!backButton) {
      const url = new URL(location.href);
      url.searchParams.set("page", page.toLowerCase());
      if (uuid !== undefined) {
        url.searchParams.set("uuid", uuid);
      }
      history.pushState({ pageMeta }, "", url);
    }
    const newMetaTitle = MetaTitle[page];
    document.title = `Meine Anmeldung: ${newMetaTitle} | Luzerner Rollenspieltage `;
    setStore("pageMeta", pageMeta);
    window.scrollTo({ top: 0 });
  }

  function createNewGame(): void {
    if (store.state !== "IDLE") {
      throw Error("ASSERTION_ERROR");
    }

    setStore(
      "currentSave",
      "gameMaster",
      "games",
      store.currentSave.gameMaster.games.length,
      {
        ...store.gameRoundEdit.form,
        uuid: crypto.randomUUID(),
      },
    );
    setStore("gameRoundEdit", "form", gameRoundDefault());
    setStore("gameRoundEdit", "errors", gameRoundEditErrorsDefault());
  }

  // old actions

  function updateSave<T extends keyof SaveFromServer>(
    prop: T,
    value: SaveFromServer[T],
  ): void {
    setStore("hasChanged", true);
    setStore("currentSave", prop, value);
  }

  async function saveCurrentState(): Promise<void> {
    if (store.state !== "IDLE") {
      throw Error("ASSERTION_ERROR");
    }

    setStore("state", "SAVING");

    const saveUrl = elysium("/rst24/save");
    const body = {
      ...store.currentSave,
      games: [
        ...store.currentSave.games.filter((game) => {
          return !store.markedForDeletionReservations.includes(game.id);
        }),
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
      const serverState = await loadServerState({
        secret: store.secret,
        pageMeta: store.pageMeta,
        showCreateMessage: false,
      });
      setStore({
        ...serverState,
        activeTab: store.activeTab,
      });
    } else {
      throw Error("SAVE_ERROR");
    }
  }

  function addTentativeReservation(tentativeReservation: Reservation) {
    setStore("hasChanged", true);
    setStore("tentativeReservations", (prev) => [
      ...prev,
      tentativeReservation,
    ]);
  }

  function deleteReservation(reservation: ReservationView): void {
    setStore("hasChanged", true);
    if (!reservation.confirmed) {
      const name = store.currentSave.name;
      setStore("tentativeReservations", (prev) =>
        prev.filter((res) => {
          if (res.gameUuid !== reservation.gameUuid) {
            return true;
          }
          if (res.friendsName === reservation.name) {
            return false;
          }
          return reservation.name !== name;
        }),
      );
    } else {
      setStore("markedForDeletionReservations", (prev) => [
        ...prev,
        reservation.reservationId,
      ]);
    }
  }

  return {
    state: store,
    actions: {
      changePage,
      createNewGame,

      // old actions
      changeTab,
      updateSave,
      saveCurrentState,
      addTentativeReservation,
      deleteReservation,
    },
  };
}
