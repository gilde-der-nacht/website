import type { JSX } from "solid-js";
import { PageTemplate } from "./PageTemplate";
import type { PageMeta } from "../load";

export function PlayerPage(props: {
  changePage: (pageMeta: PageMeta) => void;
}): JSX.Element {
  return (
    <PageTemplate title="Spielrundenübersicht" changePage={props.changePage}>
      <pre>
        <code>Noch nicht implementiert</code>
      </pre>
    </PageTemplate>
  );
}
