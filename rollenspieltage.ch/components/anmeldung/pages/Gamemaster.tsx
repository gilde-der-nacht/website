import type { JSX } from "solid-js";
import type { Page } from "../load";
import { BoxLink } from "../components/BoxLink";
import { PageTemplate } from "./PageTemplate";
import { createStore, type Store } from "solid-js/store";
import { Input } from "@common/components/Input";
import { Textarea } from "@common/components/Textarea";
import { Button } from "@common/components/Button";

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

export type GameRoundEdit = {
  titel: string;
  system: string;
  descriptionShort: string;
  descriptionLong: string;
  slot: number;
  playerCountMin: number;
  playerCountMax: number;
  tags: number[];
};

export function NewGamePage(props: {
  store: Store<GameRoundEdit>;
  changePage: (page: Page) => void;
}): JSX.Element {
  const [store, setStore] = createStore(props.store);

  function onSubmit(e: Event): void {
    e.preventDefault();
    console.log(store);
  }
  return (
    <PageTemplate
      title="Neue Spielrunde erfassen"
      changePage={props.changePage}
    >
      <form onSubmit={onSubmit} novalidate>
        <Input
          label="Titel"
          name="title"
          value={store.titel}
          onValueUpdate={(newValue) => setStore("titel", newValue)}
        />
        <Input
          label="System"
          name="System"
          value={store.system}
          onValueUpdate={(newValue) => setStore("system", newValue)}
        />
        <Textarea
          label="Beschreibung (kurz)"
          name="descriptionShort"
          value={store.descriptionShort}
          onValueUpdate={(newValue) => setStore("descriptionShort", newValue)}
        />
        <Textarea
          label="Beschreibung (lang, optional)"
          name="descriptionLong"
          value={store.descriptionLong}
          onValueUpdate={(newValue) => setStore("descriptionLong", newValue)}
        />
        <Button type="submit" kind="success" label="Spielrunde erstellen" />
      </form>
    </PageTemplate>
  );
}
