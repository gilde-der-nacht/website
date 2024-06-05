import type { JSX } from "solid-js";
import type { Program, Save } from "./data";
import type { TentativeReservation } from "./store";

export function Zusammenfassung(props: {
  save: Save;
  tentativeReservations: TentativeReservation[];
  program: Program | null;
}): JSX.Element {
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
          <ul>
            {props.tentativeReservations.map((reservation) => (
              <li>{reservation.gameUuid}</li>
            ))}
          </ul>
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
