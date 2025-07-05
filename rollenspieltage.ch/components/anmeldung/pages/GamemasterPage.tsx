import { For, Show, type JSX } from "solid-js";
import { BoxLink } from "@rst/components/anmeldung/components/BoxLink";
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
import { ellipsis } from "@common/components/utils";
import { DESCR_SHORT_MAX_CHAR } from "../forms/validation";
import { Checkbox } from "@common/components/Checkbox";

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
    <>
      <BoxLink icon="grid-2-plus" type="success" onClick={createNewGameround}>
        <h3>{TXT.createNewGameRound}</h3>
      </BoxLink>

      <br />
      <Checkbox
        label="Ich habe wenig bis keine Spielleitung-Erfahrung und möchte gerne in der Vorbereitung und/oder während der Spielrunde unterstützt werden."
        checked={store.wantsHelp}
        name="wantsHelp"
        value="wantsHelp"
        onValueUpdate={(checked) => {
          setStore("wantsHelp", checked);
        }}
      />

      <Show when={props.store.games}>
        {(games) => (
          <div style="margin-top: 2rem;">
            <h3 style="margin-bottom: 1rem;">{TXT.myGameRounds}</h3>
            <ul class="event-list" role="list">
              <For each={games().filter((game) => game.kind !== "archived")}>
                {(game) => {
                  const tags = game.tagNames
                    .map((t) => gameTags.find(({ name }) => name === t))
                    .filter((t) => t !== undefined)
                    .map(({ label }) => label);
                  return (
                    <For
                      each={game.slots}
                      fallback={
                        <Entry
                          game={game}
                          slot={null}
                          tags={tags}
                          changePage={props.changePage}
                        />
                      }
                    >
                      {(slot) => (
                        <Entry
                          game={game}
                          slot={slot}
                          tags={tags}
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
