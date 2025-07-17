import { Box, SimpleBox } from "@common/components/Box";
import { IconOnlyButton, ButtonWithIcon } from "@common/components/Button";
import { type JSX, For, Switch, Match, Show } from "solid-js";
import { type HelpEntryView, helpTypes } from "../constant/helping";
import { TXT } from "../constant/texts";
import { toRange } from "../utils/time";

export function HelpDialog(props: { entry: HelpEntryView }): JSX.Element {
  const { dateTime, entry } = props.entry;
  const helpType = helpTypes[entry.kind];

  const range = () =>
    toRange(entry.count).map((i) => {
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

  return (
    <div class="game-dialog">
      <div>
        <p>{helpType.description}</p>
      </div>
      <strong style="color: var(--clr-accent-1);">Tag, Zeit:</strong> <br />
      {TXT.days[dateTime.day]}, {dateTime.from} - {dateTime.to} Uhr
      <div class="reservations">
        <h5 style="margin-block-start: 0">Plätze reservieren</h5>
        <div class="reservation-table">
          <For each={toRange(entry().entry.count)}>
            {(seat, i) => (
              <>
                <div class="count">{i() + 1}</div>
                <Switch>
                  <Match when={seat.kind === "RESERVED_OTHER"}>
                    <Box>Bereits reserviert</Box>
                  </Match>
                  <Match when={seat.kind === "RESERVED_SPONTANIOUS"}>
                    <Box>Reserviert für spontane Spieler:innen</Box>
                  </Match>
                  <Match when={!props.isEditable}>
                    <Box>Freier Platz</Box>
                  </Match>
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
