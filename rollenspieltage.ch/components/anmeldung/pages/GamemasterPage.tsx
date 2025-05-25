import { For, Show, type JSX } from "solid-js";
import { BoxLink } from "@rst/components/anmeldung/components/BoxLink";
import { PageTemplate } from "@rst/components/anmeldung/pages/PageTemplate";
import { createStore, type Store } from "solid-js/store";
import type { ChangePageFn } from "@rst/components/anmeldung/Router";
import type { MasterClient } from "@rst/components/anmeldung/api/save";
import { TXT } from "@rst/components/anmeldung/constant/texts";
import {
  getNewGameround,
  type GameroundEditClient,
} from "@rst/components/anmeldung/api/gameround-edit";
import type { TimeSlot } from "@rst/components/anmeldung/api/shared";
import { gameTags } from "@rst/components/anmeldung/constant/tags";
import {
  DESCR_LONG_MAX_CHAR,
  DESCR_SHORT_MAX_CHAR,
} from "@rst/components/anmeldung/forms/validation";

export function GamemasterPage(props: {
  store: Store<MasterClient>;
  changePage: ChangePageFn;
}): JSX.Element {
  const [store, setStore] = createStore(props.store);
  function createNewGameround(): void {
    const newGameround = getNewGameround();
    setStore("games", store.games.length, newGameround);
    props.changePage({ kind: "EDIT_GAMEROUND", uuid: newGameround.uuid });
  }
  return (
    <PageTemplate title="Meine Spielrunden" changePage={props.changePage}>
      <BoxLink icon="grid-2-plus" type="success" onClick={createNewGameround}>
        <h3>{TXT.createNewGameRound}</h3>
      </BoxLink>

      <Show when={props.store.games}>
        {(games) => (
          <div style="margin-top: 2rem;">
            <h3 style="margin-bottom: 1rem;">{TXT.myGameRounds}</h3>
            <ul class="event-list" role="list">
              <For each={games()}>
                {(game) => {
                  const tags = game.tagNames
                    .map((t) => gameTags.find(({ name }) => name === t))
                    .filter((t) => t !== undefined)
                    .map(({ label }) => label);
                  const isDraft = gameIsDraft(game);
                  return (
                    <For
                      each={game.slots}
                      fallback={
                        <Entry
                          game={game}
                          slot={null}
                          tags={tags}
                          isDraft={isDraft}
                          changePage={props.changePage}
                        />
                      }
                    >
                      {(slot) => (
                        <Entry
                          game={game}
                          slot={slot}
                          tags={tags}
                          isDraft={isDraft}
                          changePage={props.changePage}
                        />
                      )}
                    </For>
                  );
                }}
              </For>
            </ul>
          </div>
        )}
      </Show>
    </PageTemplate>
  );
}

function Entry(props: {
  game: GameroundEditClient;
  slot: TimeSlot | null;
  isDraft: boolean;
  tags: string[];
  changePage: ChangePageFn;
}): JSX.Element {
  const { game, slot, isDraft, tags, changePage } = props;
  return (
    <li class={["event-entry", isDraft ? "gray" : ""].join(" ")}>
      <h1 class="event-title">
        {isDraft ? <em>[{TXT.draft}] </em> : ""}
        {game.title.value.length > 0 ? (
          game.title.value
        ) : (
          <em>{TXT.missingTitle}</em>
        )}
      </h1>
      <div class="event-details">
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

          {game.description.short.value.length > 0 ? (
            game.description.short.value
          ) : (
            <em>{TXT.missingShortDescription}</em>
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

function gameIsDraft(game: GameroundEditClient): boolean {
  if (game.title.value.trim().length === 0) {
    return true;
  }
  if (game.description.short.value.trim().length === 0) {
    return true;
  }
  if (game.description.short.value.length > DESCR_SHORT_MAX_CHAR) {
    return true;
  }
  if (game.description.long.value.length > DESCR_LONG_MAX_CHAR) {
    return true;
  }
  if (game.slots.length === 0) {
    return true;
  }
  return false;
}
