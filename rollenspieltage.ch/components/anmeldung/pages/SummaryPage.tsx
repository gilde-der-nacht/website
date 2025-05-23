import type { JSX } from "solid-js";
import { PageTemplate } from "@rst/components/anmeldung/pages/PageTemplate";
import type { ChangePageFn } from "@rst/components/anmeldung/Router";

export function SummaryPage(props: { changePage: ChangePageFn }): JSX.Element {
  return (
    <PageTemplate title="Zusammenfassung" changePage={props.changePage}>
      <pre>
        <code>Noch nicht implementiert</code>
      </pre>
    </PageTemplate>
  );
}
