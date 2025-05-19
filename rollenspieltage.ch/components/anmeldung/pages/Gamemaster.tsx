import { For, Show, type JSX } from "solid-js";
import type { Page } from "../load";
import { BoxLink } from "../components/BoxLink";
import { PageTemplate } from "./PageTemplate";
import type { Store } from "solid-js/store";
import type { GameMasterRound, GameMasterSave } from "../data";
import {
  DESCR_LONG_MAX_CHAR,
  DESCR_SHORT_MAX_CHAR,
  gameTags,
} from "../utils/gameRound";

export function GamemasterPage(props: {
  store: Store<GameMasterSave>;
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

      <Show when={props.store.games}>
        {(games) => (
          <div style="margin-top: 2rem;">
            <h3 style="margin-bottom: 1rem;">Meine Spielrunden</h3>
            <ul class="event-list" role="list">
              <For each={games()}>
                {(game) => {
                  const saSlots = game.slots.SATURDAY.map((s) => ({
                    ...s,
                    kind: "SLOT" as const,
                    day: "Samstag",
                  }));
                  const soSlots = game.slots.SUNDAY.map((s) => ({
                    ...s,
                    kind: "SLOT" as const,
                    day: "Sonntag",
                  }));
                  const slots =
                    saSlots.length === 0 && soSlots.length === 0
                      ? [{ kind: "NO_SLOTS" as const }]
                      : saSlots.concat(soSlots);

                  const categories = game.tags
                    .map((t) => gameTags.find(({ name }) => name === t))
                    .filter((t) => t !== undefined)
                    .map(({ label }) => label);
                  return (
                    <For each={slots}>
                      {(slot) => {
                        const isDraft = gameIsDraft(game);
                        return (
                          <li class={`event-entry ${isDraft ? "gray" : ""}`}>
                            <h1 class="event-title">
                              {isDraft ? <em>[Entwurf] </em> : ""}
                              {game.titel.length > 0 ? (
                                game.titel
                              ) : (
                                <em>Titel fehlt</em>
                              )}
                            </h1>
                            <div class="event-details">
                              <div class="event-tags">
                                <strong>System:</strong>
                                {game.system || <em>Kein System angegeben</em>}
                              </div>
                              <div class="event-tags">
                                <strong>Zeit:</strong>
                                {slot.kind === "SLOT" ? (
                                  <span>
                                    {slot.day}, {slot.from} - {slot.to} Uhr
                                  </span>
                                ) : (
                                  <em>kein Zeitslot ausgewählt</em>
                                )}
                              </div>
                              <div class="event-tags">
                                <strong>Spielende:</strong>{" "}
                                {game.playerCountMin} - {game.playerCountMax}
                              </div>{" "}
                              <div class="event-tags">
                                <strong>Kategorien:</strong>{" "}
                                {categories.join(", ") || (
                                  <em>Keine Kategorien ausgewählt</em>
                                )}
                              </div>
                            </div>
                            <div class="event-description content">
                              <p>
                                <strong>Kurzbeschreibung:</strong>
                                <br />

                                {game.descriptionShort.length > 0 ? (
                                  game.descriptionShort
                                ) : (
                                  <em>Kurzbeschreibung fehlt</em>
                                )}
                              </p>
                            </div>
                          </li>
                        );
                      }}
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

function gameIsDraft(game: GameMasterRound): boolean {
  if (game.titel.trim().length === 0) {
    return true;
  }
  if (game.descriptionShort.trim().length === 0) {
    return true;
  }
  if (game.descriptionShort.length > DESCR_SHORT_MAX_CHAR) {
    return true;
  }
  if (game.descriptionLong.length > DESCR_LONG_MAX_CHAR) {
    return true;
  }
  if (game.slots.SATURDAY.length === 0 && game.slots.SUNDAY.length === 0) {
    return true;
  }
  return false;
}
