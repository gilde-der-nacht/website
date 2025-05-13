import type { Tab } from "@lst/components/anmeldung/Tabs";
import {
  type ReservationToServer,
  type SaveFromServer,
  type SaveToServer,
  type UpdateSave,
} from "@lst/components/anmeldung/data";
import { createStore } from "solid-js/store";
import type {
  Reservation,
  ReservationView,
  Store,
} from "@lst/components/anmeldung/types";
import { loadServerState } from "@lst/components/anmeldung/load";
import { elysium } from "@common/components/utils";

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

    const saveUrl = elysium("/lst25/save");
    const body = {
      ...store.currentSave,
      games: [
        ...store.currentSave.games.filter((game) => {
          return !store.markedForDeletionReservations.includes(game.uuid);
        }),
        ...store.tentativeReservations.map((reservation) => {
          if (reservation.friends_name === null) {
            return {
              game: reservation.game_uuid,
              self: true,
              player_name: null,
            } satisfies ReservationToServer;
          }
          return {
            game: reservation.game_uuid,
            self: false,
            player_name: reservation.friends_name,
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
      const servelstate = await loadServerState({
        secret: store.secret,
        showCreateMessage: false,
      });
      setStore({
        ...servelstate,
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
          if (res.game_uuid !== reservation.game_uuid) {
            return true;
          }
          if (res.friends_name === reservation.name) {
            return false;
          }
          return reservation.name !== name;
        }),
      );
    } else {
      setStore("markedForDeletionReservations", (prev) => [
        ...prev,
        reservation.reservation_uuid,
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
