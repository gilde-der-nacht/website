import { Show, type JSX } from "solid-js";
import type { ChangePageFn } from "@rst/components/anmeldung/Router";
import type { GameroundEditClient } from "@rst/components/anmeldung/api/gameround-edit";
import type { Store } from "solid-js/store";
import { PageTemplate } from "@rst/components/anmeldung/pages/PageTemplate";

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
  return (
    <PageTemplate title="Spielrunde editieren" changePage={props.changePage}>
      <h1>edit</h1>
    </PageTemplate>
  );
}
