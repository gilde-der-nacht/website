import type { JSX } from "solid-js";
import type { PageMeta } from "../load";
import { PageTemplate } from "./PageTemplate";

export function SummaryPage(props: {
  changePage: (pageMeta: PageMeta) => void;
}): JSX.Element {
  return (
    <PageTemplate title="Zusammenfassung" changePage={props.changePage}>
      <pre>
        <code>Noch nicht implementiert</code>
      </pre>
    </PageTemplate>
  );
}
