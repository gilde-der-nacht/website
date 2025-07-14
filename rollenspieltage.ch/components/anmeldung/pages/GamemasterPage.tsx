import { Checkbox } from "@common/components/Checkbox";
import { ellipsis } from "@common/components/utils";
import {
  type GameroundEditClient,
  getNewGameround,
} from "@rst/components/anmeldung/api/gameround-edit";
import type { MasterClient } from "@rst/components/anmeldung/api/save";
import type { TimeSlot } from "@rst/components/anmeldung/api/shared";
import { BoxLink } from "@rst/components/anmeldung/components/BoxLink";
import { gameTags } from "@rst/components/anmeldung/constant/tags";
import { TXT } from "@rst/components/anmeldung/constant/texts";
import { DESCR_SHORT_MAX_CHAR } from "@rst/components/anmeldung/forms/validation";
import type { ChangePageFn } from "@rst/components/anmeldung/Router";
import { For, type JSX, Show } from "solid-js";
import { createStore, type Store } from "solid-js/store";
import { sortByDateTimeWindow } from "../utils/time";

export function GamemasterPage(props: {
  store: Store<MasterClient>;
  isEditable: boolean;
  changePage: ChangePageFn;
}): JSX.Element {
  const [store, setStore] = createStore(props.store);
  function createNewGameround(): void {
    const newGameround = getNewGameround();
    setStore("games", store.games.length, newGameround);
    props.changePage({ kind: "EDIT_GAMEROUND", uuid: newGameround.uuid });
  }

  type SlotOfGame = {
    game: GameroundEditClient;
    slot: TimeSlot | null;
  };

  const games = (): SlotOfGame[] =>
    props.store.games
      .flatMap((game): SlotOfGame[] => {
        const slots = game.slots;
        if (slots.length === 0) {
          return [
            {
              slot: null,
              game,
            },
          ];
        }

        return game.slots.map((slot) => {
          return {
            slot,
            game,
          };
        });
      })
      .toSorted((a, b) => sortByDateTimeWindow(a.slot, b.slot));

  return (
    <>
      <Show when={props.isEditable}>
        <BoxLink icon="grid-2-plus" type="success" onClick={createNewGameround}>
          <h3>{TXT.createNewGameRound}</h3>
        </BoxLink>
      </Show>
      <br />
      <Checkbox
        label="Ich habe wenig bis keine Spielleitung-Erfahrung und möchte gerne in der Vorbereitung und/oder während der Spielrunde unterstützt werden."
        checked={store.wantsHelp}
        name="wantsHelp"
        value="wantsHelp"
        onValueUpdate={(checked) => {
          setStore("wantsHelp", checked);
        }}
        disabled={!props.isEditable}
      />

      <Show when={games()}>
        {(gameList) => (
          <div style="margin-top: 2rem;">
            <h3 style="margin-bottom: 1rem;">{TXT.myGameRounds}</h3>
            <ul class="event-list" role="list">
              <For
                each={gameList().filter(({ game }) => game.kind !== "archived")}
              >
                {({ game, slot }) => {
                  const tagNames = gameTags
                    .filter((g) => game.tagNames.includes(g.name))
                    .map(({ label }) => label);
                  return (
                    <Entry
                      game={game}
                      slot={slot}
                      tags={tagNames}
                      changePage={props.changePage}
                    />
                  );
                }}
              </For>
            </ul>
          </div>
        )}
      </Show>
    </>
  );
}

function Entry(props: {
  game: GameroundEditClient;
  slot: TimeSlot | null;
  tags: string[];
  changePage: ChangePageFn;
}): JSX.Element {
  const { game, slot, tags, changePage } = props;
  return (
    <li class={["event-entry", game.kind === "draft" ? "gray" : ""].join(" ")}>
      <h3 class="event-title">
        {game.title.value.length > 0 ? (
          game.title.value
        ) : (
          <em>{TXT.missingTitle}</em>
        )}
      </h3>
      <div class="event-details">
        <div class="event-tags">
          <strong>Status:</strong>
          {TXT.publishingSteps[game.kind]}
        </div>
        <div class="event-tags">
          <strong>System:</strong>
          {game.system.value || <em>{TXT.missingSystem}</em>}
        </div>
        <div class="event-tags">
          <strong>Tag, Zeit:</strong>
          {slot !== null ? (
            <span>
              {TXT.days[slot.day]}, {slot.from} - {slot.to} Uhr
            </span>
          ) : (
            <em>{TXT.missingSlot}</em>
          )}
        </div>
        <div class="event-tags">
          <strong>Spielende:</strong> {game.playerCount.min.value} -{" "}
          {game.playerCount.max.value}
        </div>{" "}
        <div class="event-tags">
          <strong>Kategorien:</strong>{" "}
          {tags.join(", ") || <em>{TXT.missingTags}</em>}
        </div>
      </div>
      <div class="event-description content">
        <p>
          <strong>Kurzbeschreibung:</strong>
          <br />

          {game.description.short.value.length === 0 ? (
            <em>{TXT.missingShortDescription}</em>
          ) : (
            ellipsis(game.description.short.value, DESCR_SHORT_MAX_CHAR)
          )}
        </p>
      </div>
      <ul role="list" class="event-links">
        <li>
          <button
            onClick={() =>
              changePage({
                kind: "EDIT_GAMEROUND",
                uuid: game.uuid,
              })
            }
            class="event-link"
          >
            <span>Bearbeiten</span>
          </button>
        </li>
      </ul>
    </li>
  );
}
