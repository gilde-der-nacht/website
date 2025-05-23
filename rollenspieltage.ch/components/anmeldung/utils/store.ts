import { createStore, unwrap, type Store } from "solid-js/store";
import { type SaveClient } from "@rst/components/anmeldung/api/save";
import type { MetaClient } from "@rst/components/anmeldung/api/meta";
import {
  resetEditFormClient,
  type GameroundEditClient,
} from "@rst/components/anmeldung/api/gameround-edit";

export function createNewGame(
  store: Store<{ meta: MetaClient; save: SaveClient }>,
): void {
  const [_, setStore] = createStore(store);
  const newGame = unwrap(store.save.master.newEditForm);
  setStore("save", "master", "games", store.save.master.games.length, {
    ...newGame,
    uuid: crypto.randomUUID(),
    playerNames: [],
  } satisfies GameroundEditClient);
  setStore("save", "master", "newEditForm", resetEditFormClient());
}
