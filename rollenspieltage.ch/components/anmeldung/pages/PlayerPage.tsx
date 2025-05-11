import type { JSX } from "solid-js";
import type { Page } from "../load";
import { PageTemplate } from "./PageTemplate";

export function PlayerPage(props: {
  changePage: (page: Page) => void;
}): JSX.Element {
  return (
    <PageTemplate title="Spielrundenübersicht" changePage={props.changePage}>
      <pre>
        <code>Noch nicht implementiert</code>
      </pre>
    </PageTemplate>
  );
}
