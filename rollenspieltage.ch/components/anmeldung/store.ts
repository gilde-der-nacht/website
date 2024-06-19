import type { Tab } from "./Tabs";
import {
  type ReservationToServer,
  type SaveFromServer,
  type SaveToServer,
  type UpdateSave,
} from "./data";
import { createStore } from "solid-js/store";
import type { Reservation, ReservationView, Store } from "./types";
import { loadServerState } from "./load";

type Actions = {
  changeTab: (tab: Tab) => void;
  updateSave: UpdateSave;
  saveCurrentState: () => Promise<void>;
  addTentativeReservation: (tentativeReservation: Reservation) => void;
  deleteReservation: (reservation: ReservationView) => void;
};

export function initState(init: Store): {
  state: Store;
  actions: Actions;
} {
  const [store, setStore] = createStore(init);

  function changeTab(tab: Tab): void {
    setStore("activeTab", tab);
    window.scrollTo({ top: 0 });
  }

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

    const saveUrl = new URL("https://elysium.gildedernacht.ch/rst24/save");
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
      changeTab,
      updateSave,
      saveCurrentState,
      addTentativeReservation,
      deleteReservation,
    },
  };
}
