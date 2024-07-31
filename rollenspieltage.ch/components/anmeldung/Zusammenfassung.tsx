import type { JSX } from "solid-js";
import type {
  Program,
  ProgramEntry,
  ReservationFromServer,
  SaveFromServer,
} from "@rst/components/anmeldung/data";
import { Box } from "@common/components/Box";
import type { DayPeriod, Reservation } from "@rst/components/anmeldung/types";
import { MealBreak } from "@rst/components/anmeldung/MealBreak";

type ReservationAndGame = { reservation: Reservation; game: ProgramEntry };

function ReservationItem(props: {
  game: ProgramEntry;
  players: string[];
  type?: "success" | "danger" | "special" | "gray";
}): JSX.Element {
  const { game } = props;
  return (
    <Box type={props.type ?? "gray"}>
      <p>
        <strong>
          {game.title === null ? game.system : `${game.title} (${game.system})`}{" "}
        </strong>
        | {game.slot.day === "SATURDAY" ? "Samstag" : "Sonntag"},{" "}
        {game.slot.start} bis {game.slot.end} Uhr
      </p>
      <p>
        Reservation für <strong>{props.players.join(", ")}</strong>
      </p>
    </Box>
  );
}

function groupReservationsByDayAndSortByHour(
  reservations: Reservation[],
  program: Program,
): { SATURDAY: ReservationAndGame[]; SUNDAY: ReservationAndGame[] } {
  const saturday: ReservationAndGame[] = [];
  const sunday: ReservationAndGame[] = [];

  for (const reservation of reservations) {
    const game = program.gameList.find(
      (game) => game.uuid === reservation.gameUuid,
    );
    if (game?.slot.day === "SATURDAY") {
      saturday.push({ reservation, game });
    }
    if (game?.slot.day === "SUNDAY") {
      sunday.push({ reservation, game });
    }
  }

  return {
    SATURDAY: saturday.toSorted((a, b) =>
      a.game.slot.start < b.game.slot.start ? -1 : 1,
    ),
    SUNDAY: sunday.toSorted((a, b) =>
      a.game.slot.start < b.game.slot.start ? -1 : 1,
    ),
  };
}

type GroupedByGame = {
  game: ProgramEntry;
  players: string[];
}[];

function groupByGame(
  entries: ReservationAndGame[],
  selfName: string,
): GroupedByGame {
  const grouped = Object.groupBy(entries, (entry) => entry.game.uuid);
  return Object.values(grouped)
    .map((entries) => {
      const first = entries?.[0];
      if (entries === undefined || first === undefined) {
        return null;
      }
      return {
        game: first.game,
        players: entries.map((e) => e.reservation.friendsName ?? selfName),
      };
    })
    .filter((e) => e !== null);
}

type GroupedByDayPeriod = Record<DayPeriod, GroupedByGame>;
function groupByDayPeriod(groupByGame: GroupedByGame): GroupedByDayPeriod {
  const grouped: GroupedByDayPeriod = {
    MORNING: [],
    AFTERNOON: [],
    EVENING: [],
  };
  groupByGame.forEach((entry) => {
    const startTime = entry.game.slot.start;
    if (startTime < 13) {
      grouped.MORNING.push(entry);
    } else if (startTime < 18) {
      grouped.AFTERNOON.push(entry);
    } else {
      grouped.EVENING.push(entry);
    }
  });

  return grouped;
}

function ReservationList(props: {
  entries: ReservationAndGame[];
  selfName: string;
  type: "success" | "danger" | "special" | "gray";
}): JSX.Element {
  const groupedByGame = groupByGame(props.entries, props.selfName);
  const { MORNING, AFTERNOON, EVENING } = groupByDayPeriod(groupedByGame);
  const isSaturday = props.entries[0]?.game.slot.day === "SATURDAY";

  function ReservationSubList(p: { entries: GroupedByGame }): JSX.Element {
    return (
      <ul role="list" style="display: grid; gap: .5rem;">
        {p.entries.map((entry) => (
          <li>
            <ReservationItem
              game={entry.game}
              players={entry.players}
              type={props.type}
            />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <>
      {MORNING.length > 0 ? <ReservationSubList entries={MORNING} /> : null}
      {MORNING.length > 0 || AFTERNOON.length > 0 ? (
        <div style="max-inline-size: 60ch;">
          <MealBreak type="LUNCH" small={true} />
        </div>
      ) : null}
      {AFTERNOON.length > 0 ? <ReservationSubList entries={AFTERNOON} /> : null}
      {isSaturday && (AFTERNOON.length > 0 || EVENING.length > 0) ? (
        <div style="max-inline-size: 60ch;">
          <MealBreak type="DINNER" small={true} />
        </div>
      ) : null}
      {EVENING.length > 0 ? <ReservationSubList entries={EVENING} /> : null}
    </>
  );
}

export function Zusammenfassung(props: {
  save: SaveFromServer;
  tentativeReservations: Reservation[];
  markedForDeletionReservations: number[];
  program: Program;
}): JSX.Element {
  const { con, del } = props.save.games.reduce<{
    con: ReservationFromServer[];
    del: ReservationFromServer[];
  }>(
    (acc, cur) => {
      if (props.markedForDeletionReservations.includes(cur.id)) {
        return { ...acc, del: [...acc.del, cur] };
      }
      return { ...acc, con: [...acc.con, cur] };
    },
    {
      con: [],
      del: [],
    },
  );

  const confirmedReservationsGrouped = groupReservationsByDayAndSortByHour(
    con.map((game) => ({
      gameUuid: game.game,
      friendsName: game.spielerName,
    })),
    props.program,
  );

  const markedForDeletionReservationsGrouped =
    groupReservationsByDayAndSortByHour(
      del.map((game) => ({
        gameUuid: game.game,
        friendsName: game.spielerName,
      })),
      props.program,
    );

  const tentativeReservationsGrouped = groupReservationsByDayAndSortByHour(
    props.tentativeReservations,
    props.program,
  );

  return (
    <>
      <h3>Kontaktdaten</h3>
      <ul>
        <li>
          <strong>Name:</strong> {props.save.name}
        </li>
        <li>
          <strong>E-Mail:</strong> {props.save.email}
        </li>
        <li>
          <strong>Handynummer:</strong> {props.save.handynummer}
        </li>
      </ul>
      <br />
      <h3>Deine Reservationen</h3>
      {props.save.games.length === 0 &&
      props.tentativeReservations.length === 0 ? (
        <p>
          <em>Noch keine Reservationen getätigt.</em>
        </p>
      ) : null}
      {props.tentativeReservations.length > 0 ? (
        <>
          <h4>Unbestätigt</h4>
          <p>
            Bitte speichere deinen aktuellen Stand der Anmeldung, damit wir die
            folgenden Reservationen bestätigen können.
          </p>
          {tentativeReservationsGrouped.SATURDAY.length > 0 ? (
            <>
              <h5>Samstag, 24. August 2024</h5>
              <ReservationList
                entries={tentativeReservationsGrouped.SATURDAY}
                selfName={props.save.name}
                type="special"
              />
            </>
          ) : null}
          {tentativeReservationsGrouped.SUNDAY.length > 0 ? (
            <>
              <h5>Sonntag, 25. August 2024</h5>
              <ReservationList
                entries={tentativeReservationsGrouped.SUNDAY}
                selfName={props.save.name}
                type="special"
              />
            </>
          ) : null}
        </>
      ) : null}
      {del.length > 0 ? (
        <>
          <h4>Reservationen, die du entfernen möchtest</h4>
          <p>
            Bitte speichere deinen aktuellen Stand der Anmeldung, damit wir die
            folgenden Reservationen entfernen können.
          </p>
          {markedForDeletionReservationsGrouped.SATURDAY.length > 0 ? (
            <>
              <h5>Samstag, 24. August 2024</h5>
              <ReservationList
                entries={markedForDeletionReservationsGrouped.SATURDAY}
                selfName={props.save.name}
                type="danger"
              />
            </>
          ) : null}
          {markedForDeletionReservationsGrouped.SUNDAY.length > 0 ? (
            <>
              <h5>Sonntag, 25. August 2024</h5>
              <ReservationList
                entries={markedForDeletionReservationsGrouped.SUNDAY}
                selfName={props.save.name}
                type="danger"
              />
            </>
          ) : null}
        </>
      ) : null}
      {con.length > 0 ? (
        <>
          <h4>Bestätigt</h4>
          {confirmedReservationsGrouped.SATURDAY.length > 0 ? (
            <>
              <h5>Samstag, 24. August 2024</h5>
              <ReservationList
                entries={confirmedReservationsGrouped.SATURDAY}
                selfName={props.save.name}
                type="success"
              />
            </>
          ) : null}
          {confirmedReservationsGrouped.SUNDAY.length > 0 ? (
            <>
              <h5>Sonntag, 25. August 2024</h5>
              <ReservationList
                entries={confirmedReservationsGrouped.SUNDAY}
                selfName={props.save.name}
                type="success"
              />
            </>
          ) : null}
        </>
      ) : null}
      <br />
      <h3>Updates</h3>
      <p>
        <em>
          {props.save.wantsEmailUpdates ? (
            <span style="color: var(--clr-success-10);">
              Ja, ich möchte gerne Updates erhalten, wenn neue Spielrunden
              aufgeschalten werden.
            </span>
          ) : (
            <span style="color: var(--clr-danger-10);">
              Nein, ich möchte keine E-Mails über neue Spielrunden erhalten.
            </span>
          )}
        </em>
      </p>
    </>
  );
}
