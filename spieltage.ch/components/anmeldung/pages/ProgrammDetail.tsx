import {
  For,
  Match,
  Show,
  Suspense,
  Switch,
  type JSX,
  type Resource,
} from "solid-js";
import { Box, SimpleBox } from "@common/components/Box";
import { TXT } from "@common/utils/texts";
import { useParams } from "@solidjs/router";
import {
  type Public,
  type PublicProgramEntry,
} from "@lst/components/anmeldung/api/public";
import type { Result } from "@lst/components/anmeldung/api/elysium";
import { Link } from "@common/components/Link";
import { ButtonWithIcon, IconOnlyButton } from "@common/components/Button";
import { formatTime } from "@common/utils/time";
import { getDay } from "@lst/components/anmeldung/constant/time";
import type { HelpingReservation } from "../api/save";
import { InputButton } from "@common/components/InputButton";

export function ProgrammDetail(props: {
  publicResource: Resource<Result<Public>>;
  isEditable: boolean;
}): JSX.Element {
  const uuid = useParams().uuid ?? "no-uuid-found";

  return (
    <Suspense fallback={<Box>{TXT.loading.program}</Box>}>
      <Show
        when={props.publicResource()}
        fallback={<Box type="danger">{TXT.error.help}</Box>}
      >
        {(publicData) => (
          <Show
            when={publicData().kind === "SUCCESS"}
            fallback={<Box type="danger">{TXT.loading.program}</Box>}
          >
            <Show
              when={(publicData() as { data: Public }).data.programEntries.find(
                (e) => e.uuid === uuid,
              )}
              fallback={<Box type="danger">{TXT.error.gameroundUuidError}</Box>}
            >
              {(entry) => (
                <ProgramDetailContent
                  entry={entry()}
                  isEditable={props.isEditable}
                />
              )}
            </Show>
          </Show>
        )}
      </Show>
    </Suspense>
  );
}

function ProgramDetailContent(props: {
  entry: PublicProgramEntry;
  isEditable: boolean;
}): JSX.Element {
  const day = getDay(props.entry.slot.day) ?? "FRIDAY";

  // TODO
  // const range = () =>
  // props.entry.participating.kind === "NONE"
  // ? null
  // : toRange(props.entry.participating.maxSeats).map((i) => {
  // const myReservation = myHelpReservations()[i];
  // if (myReservation !== undefined) {
  // return myReservation;
  // }
  // if (props.entry.count - externalReserved <= i) {
  // return { kind: "RESERVED_OTHER" } as const;
  // }
  // return { kind: "FREE" } as const;
  // });
  const range = (): (
    | HelpingReservation
    | { kind: "RESERVED_OTHER" | "FREE" }
  )[] => [];

  //TODO
  // const hasReservedForThemselves = (): boolean => {
  // return myHelpReservations().find((r) => r.kind === "SELF") !== undefined;
  const hasReservedForThemselves = () => false;

  return (
    <>
      <div style="display: flex; gap: 1rem; flex-wrap: wrap">
        <h3>{props.entry.title}</h3>{" "}
        <Link
          href="/programm"
          class="button-link"
          style="margin-inline-start: auto;"
        >
          <ButtonWithIcon
            icon="backward"
            label="Zurück zur Programm-Übersicht"
          />
        </Link>
      </div>
      <div class="game-dialog">
        <ul role="list" style="display: grid; gap: 0.5rem;">
          <li>
            <strong style="color: var(--clr-accent-1);">Tag, Zeit:</strong>{" "}
            <br />
            {TXT.days[day]},{" "}
            {formatTime(props.entry.slot.start, { minutes: false })} -{" "}
            {formatTime(props.entry.slot.end, { minutes: false })} Uhr
          </li>
          <li>
            <strong style="color: var(--clr-accent-1);">
              Kurze Beschreibung:
            </strong>{" "}
            <br />
            {props.entry.shortDescription}
          </li>
          <li>
            <strong style="color: var(--clr-accent-1);">
              Lange Beschreibung:
            </strong>{" "}
            <br />
            {props.entry.longDescription}
          </li>
        </ul>
        <div class="reservations">
          <h5 style="margin-block-start: 0">Plätze reservieren</h5>
          <code>TODO</code>
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
                            onClick={() => {
                              // props.removeReservation(
                              //   seat.kind === "SELF"
                              //     ? seat.uuid
                              //     : "should not happen",
                              // )
                            }}
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
                            onClick={
                              () => {}
                              // props.removeReservation(
                              //   seat.kind === "FRIEND"
                              //     ? seat.uuid
                              //     : "should not happen",
                              // )
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
                              onClick={
                                () => {}
                                // props.addReservation({
                                //   kind: "SELF",
                                //   helpEntryUuid: props.entry.uuid,
                                //   uuid: crypto.randomUUID(),
                                // })
                              }
                            />
                            <InputButton
                              addFriend={
                                (_name) => {}
                                // props.addReservation({
                                //   kind: "FRIEND",
                                //   helpEntryUuid: props.entry.uuid,
                                //   name,
                                //   uuid: crypto.randomUUID(),
                                // })
                              }
                            />
                          </div>
                        }
                      >
                        <InputButton
                          addFriend={
                            (_name) => {}
                            // props.addReservation({
                            //   kind: "FRIEND",
                            //   helpEntryUuid: props.entry.uuid,
                            //   name,
                            //   uuid: crypto.randomUUID(),
                            // })
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
