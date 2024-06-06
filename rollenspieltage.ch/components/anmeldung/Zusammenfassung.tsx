import type { JSX } from "solid-js";
import type { Program, ProgramEntry, SaveFromServer } from "./data";
import type { Reservation as Reservation } from "./store";
import { Box } from "@common/components/Box";

type ReservationAndGame = { reservation: Reservation; game: ProgramEntry };

function ReservationItem(props: {
  reservation: ReservationAndGame;
  selfName: string;
  type?: "success" | "danger" | "special" | "gray";
}): JSX.Element {
  const { game, reservation } = props.reservation;
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
        Reservation für{" "}
        <strong>
          {reservation.friendsName === null
            ? props.selfName
            : reservation.friendsName}
        </strong>
      </p>
    </Box>
  );
}

function groupReservationsByDayAndSortByHour(
  reservations: Reservation[],
  program: Program | null,
): { SATURDAY: ReservationAndGame[]; SUNDAY: ReservationAndGame[] } {
  const saturday: ReservationAndGame[] = [];
  const sunday: ReservationAndGame[] = [];

  for (const reservation of reservations) {
    const game = program?.gameList.find(
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

export function Zusammenfassung(props: {
  save: SaveFromServer;
  tentativeReservations: Reservation[];
  program: Program | null;
}): JSX.Element {
  const confirmedReservationsGrouped = groupReservationsByDayAndSortByHour(
    props.save.games.map((game) => ({
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
    <div class="content">
      <h2>Zusammenfassung</h2>
      <h3>Kontaktdaten</h3>
      <ul>
        <li>
          <strong>Name:</strong> {props.save.name}
        </li>
        <li>
          <strong>E-Mail:</strong> {props.save.email}
        </li>
        <li>
          <strong>Handynummer:</strong> {props.save.email}
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
              <ul role="list" style="display: grid; gap: .5rem;">
                {tentativeReservationsGrouped.SATURDAY.map((reservation) => (
                  <li>
                    <ReservationItem
                      reservation={reservation}
                      selfName={props.save.name}
                      type="special"
                    />
                  </li>
                ))}
              </ul>
            </>
          ) : null}
          {tentativeReservationsGrouped.SUNDAY.length > 0 ? (
            <>
              <h5>Sonntag, 25. August 2024</h5>
              <ul role="list" style="display: grid; gap: .5rem;">
                {tentativeReservationsGrouped.SUNDAY.map((reservation) => (
                  <li>
                    <ReservationItem
                      reservation={reservation}
                      selfName={props.save.name}
                      type="special"
                    />
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </>
      ) : null}
      {props.save.games.length > 0 ? (
        <>
          <h4>Bestätigt</h4>
          {confirmedReservationsGrouped.SATURDAY.length > 0 ? (
            <>
              <h5>Samstag, 24. August 2024</h5>
              <ul role="list" style="display: grid; gap: .5rem;">
                {confirmedReservationsGrouped.SATURDAY.map((reservation) => (
                  <li>
                    <ReservationItem
                      reservation={reservation}
                      selfName={props.save.name}
                      type="special"
                    />
                  </li>
                ))}
              </ul>
            </>
          ) : null}
          {confirmedReservationsGrouped.SUNDAY.length > 0 ? (
            <>
              <h5>Sonntag, 25. August 2024</h5>
              <ul role="list" style="display: grid; gap: .5rem;">
                {confirmedReservationsGrouped.SUNDAY.map((reservation) => (
                  <li>
                    <ReservationItem
                      reservation={reservation}
                      selfName={props.save.name}
                      type="special"
                    />
                  </li>
                ))}
              </ul>
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
    </div>
  );
}
