import { batch, createMemo, Show, type JSX } from "solid-js";
import type { ChangePageFn } from "@rst/components/anmeldung/Router";
import type { GameroundEditClient } from "@rst/components/anmeldung/api/gameround-edit";
import { createStore, type Store } from "solid-js/store";
import { PageTemplate } from "@rst/components/anmeldung/pages/PageTemplate";
import { validateGameround } from "@rst/components/anmeldung/forms/validation";
import { GameroundForm } from "@rst/components/anmeldung/components/GameroundForm";

export function FindGameround(props: {
  allRounds: Store<GameroundEditClient[]>;
  uuid: string;
  fallback?: JSX.Element;
  children: (item: Store<GameroundEditClient>) => JSX.Element;
}): JSX.Element {
  const gameround = props.allRounds.find((gr) => gr.uuid === props.uuid);

  return (
    <Show fallback={props.fallback} when={gameround}>
      {(gr) => props.children(gr())}
    </Show>
  );
}

export function EditGamePage(props: {
  store: Store<GameroundEditClient>;
  changePage: ChangePageFn;
}): JSX.Element {
  const [store, setStore] = createStore(props.store);
  const errors = createMemo(() => validateGameround(store));

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

    props.changePage({ kind: "GAMEMASTER" });
  }
  return (
    <PageTemplate title="Spielrunde editieren" changePage={props.changePage}>
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
