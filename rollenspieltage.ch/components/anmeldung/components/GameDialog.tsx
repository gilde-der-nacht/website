import { createSignal, For, Match, Show, Switch, type JSX } from "solid-js";
import type { ProgramEntryClient } from "@rst/components/anmeldung/api/program";
import { TXT } from "@rst/components/anmeldung/constant/texts";
import { gameTags } from "@rst/components/anmeldung/constant/tags";
import type {
  ReservationClient,
  ReservationCreateClient,
} from "@rst/components/anmeldung/api/save";
import { ButtonWithIcon, IconOnlyButton } from "@common/components/Button";
import { toRange } from "@rst/components/anmeldung/utils/time";
import { Box, SimpleBox } from "@common/components/Box";

export function GameDialog(props: {
  entry: ProgramEntryClient;
  reservations: ReservationClient[];
  addReservation: (reservation: ReservationCreateClient) => void;
  removeReservation: (reservationUuid: string) => void;
}): JSX.Element {
  const gameReservations = () =>
    props.reservations.filter((r) => r.gameRound === props.entry.uuid);

  const externalReserved = Math.max(
    props.entry.playerCount.reserved + 1 - gameReservations.length,
    1,
  );

  const tagNames = props.entry.tags
    .map((t) => gameTags.find(({ name }) => name === t))
    .filter((t) => t !== undefined)
    .map(({ label }) => label);

  const max = props.entry.playerCount.max;
  const range = () =>
    toRange(max).map((i) => {
      const myReservation = gameReservations()[i];
      if (myReservation !== undefined) {
        return myReservation;
      }
      if (i + 1 === max) {
        return { kind: "RESERVED_SPONTANIOUS" } as const;
      }
      if (max - externalReserved <= i) {
        return { kind: "RESERVED_OTHER" } as const;
      }
      return { kind: "FREE" } as const;
    });

  const hasReservedForThemselves = (): boolean => {
    return gameReservations().find((r) => r.kind === "SELF") !== undefined;
  };

  return (
    <div class="game-dialog">
      <ul role="list" style="display: grid; gap: 0.5rem;">
        <li>
          <strong style="color: var(--clr-accent-1);">Spielleitung:</strong>
          <br /> {props.entry.gamemaster}
        </li>
        <li>
          <strong style="color: var(--clr-accent-1);">System:</strong>
          <br />
          {props.entry.system.trim().length > 0 ? (
            props.entry.system
          ) : (
            <em>kein System angegeben</em>
          )}
        </li>
        <li>
          <strong style="color: var(--clr-accent-1);">Tag, Zeit:</strong> <br />
          {TXT.days[props.entry.slot.day]}, {props.entry.slot.from} -{" "}
          {props.entry.slot.to} Uhr
        </li>
        <li>
          <strong style="color: var(--clr-accent-1);">Freie Plätze:</strong>
          <br />
          {Math.max(
            props.entry.playerCount.max - 1 - props.entry.playerCount.reserved,
            0,
          )}{" "}
          (von {props.entry.playerCount.max - 1})
        </li>
        <li>
          <strong style="color: var(--clr-accent-1);">Kategorien:</strong>
          <br />
          {tagNames.length > 0 ? (
            tagNames.join(", ")
          ) : (
            <em>keine Kategorien</em>
          )}
        </li>
        <li>
          <strong style="color: var(--clr-accent-1);">
            Kurze Beschreibung:
          </strong>
          <br />
          {props.entry.description.short}
        </li>
        <li>
          <strong style="color: var(--clr-accent-1);">
            Lange Beschreibung:
          </strong>
          <br />
          {props.entry.description.long.trim().length > 0 ? (
            <>{props.entry.description.long}</>
          ) : (
            <em>Keine lange Beschreibung angegeben.</em>
          )}
        </li>
      </ul>
      <div class="reservations">
        <h5 style="margin-block-start: 0">Plätze reservieren</h5>
        <div class="reservation-table">
          <For each={range()}>
            {(seat, i) => (
              <>
                <div class="count">{i() + 1}</div>
                <Switch>
                  <Match when={seat.kind === "SELF"}>
                    <SimpleBox type="success">
                      <div class="reservation-table-entry">
                        <p>Reserviert für mich </p>
                        <IconOnlyButton
                          icon="trash"
                          onClick={() =>
                            props.removeReservation(
                              seat.kind === "SELF"
                                ? seat.uuid
                                : "should not happen",
                            )
                          }
                        />
                      </div>
                    </SimpleBox>
                  </Match>
                  <Match when={seat.kind === "FRIEND"}>
                    <SimpleBox type="success">
                      <div class="reservation-table-entry">
                        <p>
                          Reserviert für "
                          {seat.kind === "FRIEND"
                            ? seat.name
                            : "[Fehler beim Laden]"}
                          "
                        </p>
                        <IconOnlyButton
                          icon="trash"
                          onClick={() =>
                            props.removeReservation(
                              seat.kind === "FRIEND"
                                ? seat.uuid
                                : "should not happen",
                            )
                          }
                        />
                      </div>
                    </SimpleBox>
                  </Match>
                  <Match when={seat.kind === "RESERVED_OTHER"}>
                    <Box>Bereits reserviert</Box>
                  </Match>
                  <Match when={seat.kind === "RESERVED_SPONTANIOUS"}>
                    <Box>Reserviert für spontane Spieler:innen</Box>
                  </Match>
                  <Match when={seat.kind === "FREE"}>
                    <Show
                      when={hasReservedForThemselves()}
                      fallback={
                        <div style="display:grid; gap: 1rem; grid-template-columns: max-content 1fr;">
                          <ButtonWithIcon
                            icon="person-to-portal"
                            label="Mich anmelden"
                            kind="success"
                            onClick={() =>
                              props.addReservation({
                                kind: "SELF",
                                gameRound: props.entry.uuid,
                              })
                            }
                          />
                          <InputButton
                            addFriend={(name) =>
                              props.addReservation({
                                kind: "FRIEND",
                                gameRound: props.entry.uuid,
                                name,
                              })
                            }
                          />
                        </div>
                      }
                    >
                      <InputButton
                        addFriend={(name) =>
                          props.addReservation({
                            kind: "FRIEND",
                            gameRound: props.entry.uuid,
                            name,
                          })
                        }
                      />
                    </Show>
                  </Match>
                </Switch>
              </>
            )}
          </For>
        </div>
      </div>
    </div>
  );
}

function InputButton(props: {
  addFriend: (name: string) => void;
}): JSX.Element {
  const [name, setName] = createSignal("");
  return (
    <form
      novalidate={true}
      style="display: grid; gap: 0rem; grid-template-columns: 1fr max-content"
      class="input-button"
      onSubmit={(e: SubmitEvent) => {
        e.preventDefault();
        const n = name();
        if (n.trim().length > 0) {
          props.addFriend(n);
        }
      }}
    >
      <input
        type="text"
        style="border-color: var(--clr-special-9);"
        value={name()}
        onInput={(e) => setName(e.target.value)}
      />
      <ButtonWithIcon
        icon="arrow-right"
        type="submit"
        label="Begleitperson anmelden"
        kind="special"
      />
    </form>
  );
}
