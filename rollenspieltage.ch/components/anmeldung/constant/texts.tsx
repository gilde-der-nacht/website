import type { PerDay } from "@rst/components/anmeldung/utils/time";
import type { PageKind } from "@rst/components/anmeldung/api/meta";

const registrationDeadline = "Donnerstag, 21. August 2025";

const registrationStarted = (
  <>
    Deine Anmeldung wurde erfolgreich gestartet.
    <br />
    <br />
    Wir haben eine E-Mail an deine Adresse gesendet. In dieser E-Mail findest du
    einen persönlichen Link, um deine Anmeldung bis am{" "}
    <strong>{registrationDeadline}</strong> anzupassen.
  </>
);

const loading = <p>Deine Anmeldung wird geladen...</p>;

const error = {
  general: (
    <p>
      Leider ist ein unerwarteter Fehler passiert. Versuche deine Anmeldung
      erneut zu laden. Wiederholt sich dieser Fehler, bitte kontaktiere uns
      sobald als möglich über das <a href="/kontakt">Kontaktformular</a>, da
      dies nicht passieren sollte.
    </p>
  ),
  secretError: (
    <p>
      Wir konnten leider keine Anmeldung finden. Wenn du bereits eine Anmeldung
      begonnen hast, solltest du den korrekten Link per E-Mail erhalten haben.
      <br />
      <br /> Falls du noch keine Anmeldung begonnen hast, kannst du{" "}
      <a href="/anmeldung">hier</a> deine persönliche Anmeldung beginnen. <br />
      <br />
      Für generelle Fragen oder Probleme, schreibe uns doch bitte über unser{" "}
      <a href="/kontatk">Kontaktformular</a>.
    </p>
  ),
};

const days = {
  SATURDAY: "Samstag",
  SUNDAY: "Sonntag",
} satisfies PerDay<string>;

const pageTitle: Record<PageKind, string> = {
  CHOOSE: "Übersicht",
  PLAYER: "Spielanmeldung",
  GAMEMASTER: "Spielleitung",
  NEW_GAMEROUND: "Neue Spielrunde",
  EDIT_GAMEROUND: "Spielrunde editieren",
  HELPING: "Helfen",
  SUMMARY: "Zusammenfassung",
};

const metaTitle = "Meine Anmeldung: {} | Luzerner Rollenspieltage";

export const TXT = {
  registrationDeadline,
  registrationStarted,
  loading,
  error,
  days,
  pageTitle,
  metaTitle,
};
