import type { PerDay } from "@rst/components/anmeldung/utils/time";
import type { PageKind } from "@rst/components/anmeldung/api/meta";
import type { PublishState } from "@rst/components/anmeldung/api/shared";

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

const loading = {
  registration: <p>Deine Anmeldung wird geladen...</p>,
  program: <p>Das Programm wird geladen...</p>,
};

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
  gameroundUuidError: (
    <p>
      Wir konnten leider keine Spielrunde unter diesem Link finden.
      <br />
      <br />
      Vermutlich liegt es an uns. Bitte kontaktiere uns sobald als möglich über
      das{" "}
    </p>
  ),
  ourMistake: (
    <p>
      Leider ist ein unerwarteter Fehler passiert. Vermutlich liegt es an uns.
      Bitte kontaktiere uns sobald als möglich über das{" "}
      <a href="/kontakt">Kontaktformular</a>.
    </p>
  ),
  program: (
    <p>
      Leider ist ein unerwarteter Fehler passiert beim Laden des Programmes.
      Vermutlich liegt es an uns. Bitte kontaktiere uns sobald als möglich über
      das <a href="/kontakt">Kontaktformular</a>.
    </p>
  ),
  help: (
    <p>
      Leider ist ein unerwarteter Fehler passiert beim Laden von Daten.
      Vermutlich liegt es an uns. Bitte kontaktiere uns sobald als möglich über
      das <a href="/kontakt">Kontaktformular</a>.
    </p>
  ),
};

const draft = "Entwurf";
const createNewGameRound = "Neue Spielrunde erstellen";
const myGameRounds = "Meine Spielrunden";
const missingTitle = "Titel fehlt";
const missingSystem = "kein System angegeben";
const missingSlot = "kein Zeitslot ausgewählt";
const missingTags = "keine Kategorien ausgewählt";
const missingShortDescription = "Kurzbeschreibung fehlt";
const invalidEmail =
  "Die Eingabe scheint keine gültige E-Mail-Adresse zu sein.";
const mandatoryField = "Dies ist ein Pflichtfeld.";
const charLimitBy = "Dieses Feld ist auf {} Zeichen limitiert.";
const tagIdeas =
  "Findest du, es gäbe noch weitere hilfreiche Kategorien? Schreibe uns deinen Vorschlag per Kontaktformular.";

const days = {
  SATURDAY: "Samstag",
  SUNDAY: "Sonntag",
} satisfies PerDay<string>;

const pageTitle: Record<PageKind, string> = {
  CHOOSE: "Übersicht",
  PLAYER: "Spielanmeldung",
  GAME: "Spielanmeldung",
  GAMEMASTER: "Spielleitung",
  EDIT_GAMEROUND: "Spielrunde editieren",
  HELPING: "Helfen",
  "HELPING-SLOT": "Helfen",
  SUMMARY: "Zusammenfassung",
};

const publishingSteps: Record<PublishState, string> = {
  draft: "Entwurf",
  published: "Veröffentlicht",
  archived: "Gelöscht",
};

const metaTitle = "Meine Anmeldung: {} | Luzerner Rollenspieltage";

export const TXT = {
  registrationDeadline,
  registrationStarted,
  loading,
  error,
  draft,
  createNewGameRound,
  myGameRounds,
  missingTitle,
  missingSystem,
  missingSlot,
  missingTags,
  missingShortDescription,
  invalidEmail,
  mandatoryField,
  charLimitBy,
  tagIdeas,
  days,
  pageTitle,
  publishingSteps,
  metaTitle,
};
