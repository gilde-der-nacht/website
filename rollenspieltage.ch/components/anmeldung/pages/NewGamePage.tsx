import { batch, createMemo, type JSX } from "solid-js";
import { PageTemplate } from "@rst/components/anmeldung/pages/PageTemplate";
import { createStore, type Store } from "solid-js/store";
import type { ChangePageFn } from "@rst/components/anmeldung/Router";
import type { GameroundNewEditClient } from "@rst/components/anmeldung/api/gameround-edit";
import { validateNewGameround } from "@rst/components/anmeldung/forms/validation";
import { GameroundForm } from "@rst/components/anmeldung/components/GameroundForm";

export function NewGamePage(props: {
  store: Store<GameroundNewEditClient>;
  changePage: ChangePageFn;
  createNewGame: () => void;
}): JSX.Element {
  const [store, setStore] = createStore(props.store);
  const errors = createMemo(() => validateNewGameround(store));

  function onSubmit(e: Event): void {
    e.preventDefault();

    const [min, max] = [
      store.playerCount.min.value,
      store.playerCount.max.value,
    ]
      .map((n) => Math.max(1, n))
      .toSorted((a, b) => a - b);

    batch(() => {
      setStore("playerCount", "min", "value", min ?? 1);
      setStore("playerCount", "max", "value", max ?? 1);
    });

    if (errors().hasErrors) {
      return;
    }

    props.createNewGame();
    props.changePage({ kind: "GAMEMASTER" });
  }

  return (
    <PageTemplate
      title="Neue Spielrunde erfassen"
      changePage={props.changePage}
    >
      <GameroundForm
        store={props.store}
        onSubmit={onSubmit}
        onCancel={() => {
          props.changePage({ kind: "GAMEMASTER" });
        }}
      />
    </PageTemplate>
  );
}
