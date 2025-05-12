import type { JSX } from "solid-js";
import type { Page } from "../load";
import { BoxLink } from "../components/BoxLink";
import { PageTemplate } from "./PageTemplate";

export function GamemasterPage(props: {
  changePage: (page: Page) => void;
}): JSX.Element {
  return (
    <PageTemplate title="Meine Spielrunden" changePage={props.changePage}>
      <BoxLink
        icon="grid-2-plus"
        type="success"
        onClick={() => props.changePage("GAMEMASTER_NEW")}
      >
        <h3>Neue Spielrunde erstellen</h3>
      </BoxLink>
    </PageTemplate>
  );
}

export function NewGamePage(props: {
  editForm: boolean;
  changePage: (page: Page) => void;
}): JSX.Element {
  function onSubmit(): void {
    console.log("submit");
  }
  return (
    <PageTemplate
      title="Neue Spielrunde erfassen"
      changePage={props.changePage}
    >
      <form onSubmit={onSubmit} novalidate></form>
    </PageTemplate>
  );
}
