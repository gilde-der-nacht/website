import {
  createResource,
  For,
  Match,
  Show,
  Suspense,
  Switch,
  type JSX,
} from "solid-js";
import {
  findHelpEntryByUuid,
  helpTypes,
  type HelpEntryView,
} from "@lst/components/anmeldung/constant/helping";
import { toRange } from "@common/utils/time";
import { InputButton } from "@common/components/InputButton";
import { ButtonWithIcon, IconOnlyButton } from "@common/components/Button";
import { Box, SimpleBox } from "@common/components/Box";
import { TXT } from "@common/utils/texts";
import type {
  HelpingReservation,
  Save,
} from "@lst/components/anmeldung/api/save";
import { A, useParams, useSearchParams } from "@solidjs/router";
import { createStore, type Store } from "solid-js/store";
import { loadHelp } from "@lst/components/anmeldung/api/help";

export function HelfenDetail(props: {
  store: Store<Save>;
  link: (path: string) => string;
  isEditable: boolean;
}): JSX.Element {
  const [store, setStore] = createStore(props.store);
  const uuid = useParams().uuid ?? "no-uuid-found";
  const entry = findHelpEntryByUuid(uuid);
  const [searchParams] = useSearchParams();
  const [helpResource] = createResource(() =>
    loadHelp(String(searchParams["secret"])),
  );

  return (
    <Suspense fallback={<Box>{TXT.loading.program}</Box>}>
      <Show
        when={helpResource()}
        fallback={<Box type="danger">{TXT.error.help}</Box>}
      >
        {(help) => (
          <Show
            when={help().kind === "SUCCESS"}
            fallback={
              <Box type="danger">
                <p>Plan konnte nicht geladen werden.</p>
              </Box>
            }
          >
            <Show when={entry}>
              {(e) => (
                <HelfenDetailContent
                  entry={e()}
                  helpReservations={props.store.helping}
                  externalHelpReservations={(help() as { data: string[] }).data}
                  isEditable={props.isEditable}
                  addReservation={(reservation) =>
                    setStore("helping", store.helping.length, {
                      ...reservation,
                      uuid: crypto.randomUUID(),
                    })
                  }
                  removeReservation={(reservationUuid) => {
                    setStore(
                      "helping",
                      store.helping.filter((r) => r.uuid !== reservationUuid),
                    );
                  }}
                  link={props.link}
                />
              )}
            </Show>
          </Show>
        )}
      </Show>
    </Suspense>
  );
}

function HelfenDetailContent(props: {
  entry: HelpEntryView;
  helpReservations: HelpingReservation[];
  externalHelpReservations: string[];
  isEditable: boolean;
  addReservation: (reservation: HelpingReservation) => void;
  removeReservation: (reservationUuid: string) => void;
  link: (path: string) => string;
}): JSX.Element {
  const { dateTime, entry } = props.entry;
  const helpType = helpTypes[entry.kind];

  const helpReservations = () =>
    props.helpReservations.filter(
      (r) => "helpEntryUuid" in r && r.helpEntryUuid === entry.uuid,
    );

  const externalReserved = props.externalHelpReservations.filter(
    (r) => r === entry.uuid,
  ).length;

  const range = () =>
    toRange(entry.count).map((i) => {
      const myReservation = helpReservations()[i];
      if (myReservation !== undefined) {
        return myReservation;
      }
      if (entry.count - externalReserved <= i) {
        return { kind: "RESERVED_OTHER" } as const;
      }
      return { kind: "FREE" } as const;
    });

  const hasReservedForThemselves = (): boolean => {
    return helpReservations().find((r) => r.kind === "SELF") !== undefined;
  };

  return (
    <>
      <div style="display: flex; gap: 1rem; flex-wrap: wrap; justify-content: space-between;">
        <h3>{helpType.title}</h3>
        <A href={props.link("/helfen")} class="button-link">
          <ButtonWithIcon icon="backward" label="Zurück zur Helfer-Übersicht" />
        </A>
      </div>
      <div class="game-dialog">
        <ul role="list" style="display: grid; gap: 0.5rem;">
          <li>
            <strong style="color: var(--clr-accent-1);">Tag, Zeit:</strong>{" "}
            <br />
            {TXT.days[dateTime.day]}, {dateTime.from} - {dateTime.to} Uhr
          </li>
          <li>
            <strong style="color: var(--clr-accent-1);">Beschreibung:</strong>{" "}
            <br />
            {helpType.description}
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
                    <Match when={seat.kind === "RESERVED_OTHER"}>
                      <Box>Bereits reserviert</Box>
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
                                  helpEntryUuid: entry.uuid,
                                  uuid: crypto.randomUUID(),
                                })
                              }
                            />
                            <InputButton
                              addFriend={(name) =>
                                props.addReservation({
                                  kind: "FRIEND",
                                  helpEntryUuid: entry.uuid,
                                  name,
                                  uuid: crypto.randomUUID(),
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
                              helpEntryUuid: entry.uuid,
                              name,
                              uuid: crypto.randomUUID(),
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
    </>
  );
}
