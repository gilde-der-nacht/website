import { For, Match, Show, Switch, type Accessor, type JSX } from "solid-js";
import type {
  Program,
  ProgramPublicEntry,
} from "@rst/components/anmeldung/api/program";
import type { Roles } from "@rst/components/anmeldung/api/meta";
import { useParams } from "@solidjs/router";
import { Box, SimpleBox } from "@common/components/Box";
import { TXT } from "@common/utils/texts";
import { getDay } from "@rst/components/anmeldung/constant/time";
import { formatTime, toRange } from "@common/utils/time";
import { Temporal } from "@js-temporal/polyfill";
import { RouterLink } from "@common/components/Link";
import { BoxLink } from "@common/components/BoxLink";
import { arr, type Reactive } from "@common/utils/reactivity";
import type { Participating } from "@rst/components/anmeldung/api/save";
import { InputButton } from "@common/components/InputButton";
import { ButtonWithIcon, IconOnlyButton } from "@common/components/Button";
import { getCurrentTimestamp } from "@common/utils/shared";

export function WartelisteDetail(props: {
  waitingEntries$: Reactive<Participating[]>;
  programData: Accessor<Program>;
  isEditable: boolean;
  roles: Roles;
}): JSX.Element {
  const uuid = useParams().uuid ?? "no-uuid-found";

  return (
    <Show
      when={props
        .programData()
        .publicEntries.find((e) => e.timeSlot.uuid === uuid)}
      fallback={<Box type="danger">{TXT.error.gameroundUuidError}</Box>}
    >
      {(entry) => (
        <WartelisteDetailContent
          entry={entry()}
          waitingEntries$={props.waitingEntries$}
          isEditable={props.isEditable}
          programData={props.programData}
          roles={props.roles}
        />
      )}
    </Show>
  );
}

function WartelisteDetailContent(props: {
  entry: ProgramPublicEntry;
  waitingEntries$: Reactive<Participating[]>;
  isEditable: boolean;
  programData: Accessor<Program>;
  roles: Roles;
}): JSX.Element {
  const day = () =>
    Temporal.PlainDate.from(props.entry.timeSlot.slot.start.day);
  const startTime = () =>
    Temporal.PlainTime.from(props.entry.timeSlot.slot.start.time);
  const endTime = () =>
    startTime().add(Temporal.Duration.from(props.entry.timeSlot.slot.duration));

  const myEntries = () =>
    props.waitingEntries$
      .get()
      .filter((r) => r.entryUuid === props.entry.timeSlot.uuid);
  const hasEntryOfThemself = (): boolean => {
    return myEntries().some((r) => r.name.kind === "SELF");
  };

  const range = () => {
    const numberOfLines = hasEntryOfThemself()
      ? myEntries().length + 1
      : myEntries().length + 2;
    return toRange(numberOfLines).map((i) => {
      const myEntry = myEntries()[i];
      if (myEntry !== undefined) {
        if (myEntry.name.kind === "SELF") {
          return {
            kind: "SELF",
            uuid: myEntry.uuid,
          } as const;
        } else {
          return {
            kind: "FRIEND",
            uuid: myEntry.uuid,
            name: myEntry.name.friendsName,
          } as const;
        }
      }
      if (i + 1 === numberOfLines) {
        return { kind: "FREE_FRIEND" } as const;
      }
      return { kind: "FREE_SELF" } as const;
    });
  };

  function addReservation(reservation: Participating): void {
    arr.push(props.waitingEntries$, reservation);
  }

  function removeReservation(reservationUuid: string): void {
    arr.remove(props.waitingEntries$, (r) => r.uuid !== reservationUuid);
  }

  return (
    <>
      <h2>Warteliste</h2>
      <RouterLink
        href={`/programm/${props.entry.timeSlot.uuid}`}
        class="button-link"
      >
        <BoxLink icon="backward">
          <h6 style="margin: 0;">Zurück zur Spielrunde</h6>
          <h4>{props.entry.title}</h4>
          <h5 style="margin: 0;">
            {TXT.days[getDay(day()) ?? "FRIDAY"]}, {formatTime(startTime())} -{" "}
            {formatTime(endTime())} Uhr
          </h5>
        </BoxLink>
      </RouterLink>

      <div class="reservations" style="margin-block-start: 1rem;">
        <div class="reservation-table">
          <For
            each={range()}
            fallback={<em>Teilnahme ohne Anmeldung möglich.</em>}
          >
            {(seat, i) => (
              <>
                <div class="count">{i() + 1}</div>
                <Switch>
                  {/*
                  <Match when={seat.kind === "RESERVED_OTHER_WITH_NAME"}>
                    <Box>Bereits eingetragen ({seat.name})</Box>
                  </Match>
                  */}
                  <Match when={!props.isEditable}>
                    <Box>Freier Platz</Box>
                  </Match>
                  <Match when={seat.kind === "SELF"}>
                    <SimpleBox type="success">
                      <div class="reservation-table-entry">
                        <p>Eintrag für mich </p>
                        <IconOnlyButton
                          icon="trash"
                          onClick={() => {
                            removeReservation(
                              seat.kind === "SELF"
                                ? seat.uuid
                                : "should not happen",
                            );
                          }}
                        />
                      </div>
                    </SimpleBox>
                  </Match>
                  <Match when={seat.kind === "FRIEND"}>
                    <SimpleBox type="success">
                      <div class="reservation-table-entry">
                        <p>
                          Eintrag für "
                          {seat.kind === "FRIEND"
                            ? seat.name
                            : "[Fehler beim Laden]"}
                          "
                        </p>
                        <IconOnlyButton
                          icon="trash"
                          onClick={() => {
                            removeReservation(
                              seat.kind === "FRIEND"
                                ? seat.uuid
                                : "should not happen",
                            );
                          }}
                        />
                      </div>
                    </SimpleBox>
                  </Match>
                  <Match when={seat.kind === "FREE_SELF"}>
                    <ButtonWithIcon
                      icon="person-to-portal"
                      label="Mich eintragen"
                      kind="success"
                      onClick={() => {
                        addReservation({
                          entryUuid: props.entry.timeSlot.uuid,
                          uuid: crypto.randomUUID(),
                          timestamp: getCurrentTimestamp(),
                          name: {
                            kind: "SELF",
                          },
                        });
                      }}
                    />
                  </Match>
                  <Match when={seat.kind === "FREE_FRIEND"}>
                    <InputButton
                      label="Begleitperson eintragen"
                      addFriend={(name) => {
                        addReservation({
                          entryUuid: props.entry.timeSlot.uuid,
                          timestamp: getCurrentTimestamp(),
                          name: {
                            kind: "FRIEND",
                            friendsName: name,
                          },
                          uuid: crypto.randomUUID(),
                        });
                      }}
                    />
                  </Match>
                </Switch>
              </>
            )}
          </For>
        </div>
      </div>
    </>
  );
}
