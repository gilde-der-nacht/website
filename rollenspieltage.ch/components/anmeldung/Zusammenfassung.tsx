import type { JSX } from "solid-js";
import type { Program, Save } from "./data";
import type { TentativeReservation as Reservation } from "./store";
import { Box } from "@common/components/Box";

function ReservationItem(props: {
  reservation: Reservation;
  program: Program | null;
  protagonistName: string;
  type?: "success" | "danger" | "special" | "gray";
}): JSX.Element {
  const game = props.program?.gameList.find(
    (game) => game.uuid === props.reservation.gameUuid,
  );

  if (game === undefined || props.program === null) {
    return (
      <Box type="danger">
        Leider ist ein Fehler aufgetreten. Bitte lade die Seite neu oder melde
        dich bei uns per Kontaktformluar.
      </Box>
    );
  }

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
        Reservation für
        <strong>
          {props.reservation.friendsName === null
            ? props.protagonistName
            : props.reservation.friendsName}
        </strong>
      </p>
    </Box>
  );
}

function groupReservationByDay(
  reservations: Reservation[],
  program: Program | null,
): { SATURDAY: Reservation[]; SUNDAY: Reservation[] } {
  const SATURDAY: Reservation[] = [];
  const SUNDAY: Reservation[] = [];

  for (const reservation of reservations) {
    const game = program?.gameList.find(
      (game) => game.uuid === reservation.gameUuid,
    );
    if (game?.slot.day === "SATURDAY") {
      SATURDAY.push(reservation);
    }
    if (game?.slot.day === "SUNDAY") {
      SUNDAY.push(reservation);
    }
  }

  return { SATURDAY, SUNDAY };
}

export function Zusammenfassung(props: {
  save: Save;
  tentativeReservations: Reservation[];
  program: Program | null;
}): JSX.Element {
  const tentativeReservationsGrouped = groupReservationByDay(
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
      {props.tentativeReservations.length === 0 ? (
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
                      program={props.program}
                      protagonistName={props.save.name}
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
                      program={props.program}
                      protagonistName={props.save.name}
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
