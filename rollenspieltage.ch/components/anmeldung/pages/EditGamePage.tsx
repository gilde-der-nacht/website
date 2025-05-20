import type { JSX } from "solid-js";
import type { GameMasterRound } from "../data";
import { createStore, type Store } from "solid-js/store";

export function EditGamePage(props: {
  store: Store<GameMasterRound>;
}): JSX.Element {
  const [store, setStore] = createStore(props.store);

  return <h1>Edit</h1>;
}
