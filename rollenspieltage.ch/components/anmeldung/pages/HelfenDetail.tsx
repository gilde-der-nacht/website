import { For, Match, Show, Switch, type JSX } from "solid-js";
import {
  findHelpEntryByUuid,
  helpTypes,
  type HelpEntry,
} from "@rst/components/anmeldung/constant/helping";
import { formatTime, toRange } from "@common/utils/time";
import { InputButton } from "@common/components/InputButton";
import { ButtonWithIcon, IconOnlyButton } from "@common/components/Button";
import { Box, SimpleBox } from "@common/components/Box";
import { TXT } from "@common/utils/texts";
import type { HelpingReservation } from "@rst/components/anmeldung/api/save";
import { useParams } from "@solidjs/router";
import {
  type Public,
  type Reservations,
} from "@rst/components/anmeldung/api/public";
import { getDay } from "@rst/components/anmeldung/constant/time";
import { assert } from "@common/components/utils";
import { arr, type Reactive } from "@common/utils/reactivity";
import { Link } from "@common/components/Link";
import type { PublicAdmin } from "@rst/components/anmeldung/api/admin";

export function HelfenDetail(props: {
  reservations$: Reactive<HelpingReservation[]>;
  publicData: Public;
  adminData: PublicAdmin;
  isEditable: boolean;
}): JSX.Element {
  const uuid = useParams().uuid ?? "no-uuid-found";
  const entry = findHelpEntryByUuid(uuid);

  return (
    <Show
      when={entry}
      fallback={
        <Box type="danger">
          <p>Details konnten nicht geladen werden.</p>
        </Box>
      }
    >
      {(e) => (
        <HelfenDetailContent
          entry={e()}
          myHelpReservations={props.reservations$.get()}
          allReservations={props.publicData.reservations}
          isEditable={props.isEditable}
          addReservation={(reservation) =>
            arr.push(props.reservations$, {
              ...reservation,
              uuid: crypto.randomUUID(),
            })
          }
          removeReservation={(reservationUuid) => {
            arr.remove(props.reservations$, (r) => r.uuid !== reservationUuid);
          }}
          adminData={props.adminData}
        />
      )}
    </Show>
  );
}

function HelfenDetailContent(props: {
  entry: HelpEntry;
  myHelpReservations: HelpingReservation[];
  allReservations: Reservations;
  isEditable: boolean;
  addReservation: (reservation: HelpingReservation) => void;
  removeReservation: (reservationUuid: string) => void;
  adminData: PublicAdmin;
}): JSX.Element {
  const { dateTime, kind } = props.entry;
  const helpType = helpTypes[kind];
  const day = getDay(dateTime.startDate);
  assert(
    day !== null,
    `Date '${JSON.stringify(dateTime.startDate)}' is not a valid event date.`,
  );

  const myHelpReservations = () =>
    props.myHelpReservations.filter(
      (r) => "entryUuid" in r && r.entryUuid === props.entry.uuid,
    );

  const range = () =>
    toRange(props.entry.count).map((i) => {
      const myReservation = myHelpReservations()[i];
      if (myReservation !== undefined) {
        return myReservation;
      }

      const externalReservations =
        props.allReservations[props.entry.uuid] ?? [];

      const negativeOffset = props.entry.count - externalReservations.length;
      const externalReservation =
        props.allReservations[props.entry.uuid]?.[i - negativeOffset];

      if (externalReservation !== undefined) {
        return { kind: "RESERVED_OTHER", uuid: externalReservation } as const;
      }

      return { kind: "FREE" } as const;
    });

  const hasReservedForThemselves = (): boolean => {
    return myHelpReservations().find((r) => r.kind === "SELF") !== undefined;
  };

  function getExternalName(uuid?: string): string {
    const name = props.adminData.admin?.help.find((e) => e.uuid === uuid)?.name;
    return name === undefined ? "" : `(${name})`;
  }

  return (
    <>
      <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
        <h3>{helpType.title}</h3>
        <Link
          href="/helfen"
          class="button-link"
          style="margin-inline-start: auto;"
        >
          <ButtonWithIcon icon="backward" label="Zurück zur Helfer-Übersicht" />
        </Link>
      </div>
      <div class="game-dialog">
        <ul role="list" style="display: grid; gap: 0.5rem;">
          <li>
            <strong style="color: var(--clr-accent-1);">Tag, Zeit:</strong>{" "}
            <br />
            {TXT.days[day]},{" "}
            {formatTime(dateTime.startDate.toPlainTime(), { minutes: false })} -{" "}
            {formatTime(dateTime.endDate.toPlainTime(), { minutes: false })} Uhr
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
                      <Box>Bereits reserviert {getExternalName(seat.uuid)}</Box>
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
                                  entryUuid: props.entry.uuid,
                                  uuid: crypto.randomUUID(),
                                })
                              }
                            />
                            <InputButton
                              addFriend={(name) =>
                                props.addReservation({
                                  kind: "FRIEND",
                                  entryUuid: props.entry.uuid,
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
                              entryUuid: props.entry.uuid,
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
