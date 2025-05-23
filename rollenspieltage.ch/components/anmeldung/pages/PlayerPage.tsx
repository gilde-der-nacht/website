import type { JSX } from "solid-js";
import { PageTemplate } from "@rst/components/anmeldung/pages/PageTemplate";
import type { ChangePageFn } from "@rst/components/anmeldung/Router";

export function PlayerPage(props: { changePage: ChangePageFn }): JSX.Element {
  return (
    <PageTemplate title="Spielrundenübersicht" changePage={props.changePage}>
      <pre>
        <code>Noch nicht implementiert</code>
      </pre>
    </PageTemplate>
  );
}
