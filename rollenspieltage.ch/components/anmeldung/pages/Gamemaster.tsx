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

export const gameTags = [
  {
    name: "children",
    label: "Kinderfreundlich",
    description: "...",
  },
] as const;
export type GameTag = (typeof gameTags)[number]["name"];

export type GameRoundEdit = {
  form: GameRoundEditForm;
  errors: GameRoundEditErrors;
};

export type GameRoundEditForm = {
  titel: string;
  system: string;
  descriptionShort: string;
  descriptionLong: string;
  slot: number;
  playerCountMin: number;
  playerCountMax: number;
  tags: GameTag[];
};

export type GameRoundEditErrors = {
  titleMissing: boolean;
  descriptionShortTooLong: boolean;
  descriptionLongTooLong: boolean;
  slotMissing: boolean;
  playerCountInvalid: boolean;
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
          value={store.form.titel}
          onValueUpdate={(newValue) => setStore("form", "titel", newValue)}
        />
        <Input
          label="System"
          name="System"
          value={store.form.system}
          onValueUpdate={(newValue) => setStore("form", "system", newValue)}
        />
        <Textarea
          label="Beschreibung (kurz)"
          name="descriptionShort"
          value={store.form.descriptionShort}
          onValueUpdate={(newValue) =>
            setStore("form", "descriptionShort", newValue)
          }
        />
        <Textarea
          label="Beschreibung (lang, optional)"
          name="descriptionLong"
          value={store.form.descriptionLong}
          onValueUpdate={(newValue) =>
            setStore("form", "descriptionLong", newValue)
          }
        />
        <Button type="submit" kind="success" label="Spielrunde erstellen" />
      </form>
    </PageTemplate>
  );
}
