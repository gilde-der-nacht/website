import type { JSX } from "solid-js";
import type { ChangePageFn } from "@rst/components/anmeldung/Router";
import type { GameroundEditClient } from "@rst/components/anmeldung/api/gameround-edit";
import type { Store } from "solid-js/store";
import { PageTemplate } from "@rst/components/anmeldung/pages/PageTemplate";

export function EditGamePage(props: {
  store: Store<GameroundEditClient[]>;
  changePage: ChangePageFn;
}): JSX.Element {
  return (
    <PageTemplate title="Spielrunde editieren" changePage={props.changePage}>
      <h1>edit</h1>
    </PageTemplate>
  );
}
