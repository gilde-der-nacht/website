import type { JSX } from "solid-js";
import { PageTemplate } from "./PageTemplate";
import type { Page } from "../load";

export function HelpingPage(props: {
  changePage: (page: Page) => void;
}): JSX.Element {
  return (
    <PageTemplate title="Helfen" changePage={props.changePage}>
      <pre>
        <code>Noch nicht implementiert</code>
      </pre>
    </PageTemplate>
  );
}
