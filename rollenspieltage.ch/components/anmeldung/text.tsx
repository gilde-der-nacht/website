import type { PerDay } from "./utils/time";

export const TXT = (function init() {
  const registrationDeadline = "Donnerstag, 21. August 2025";
  const registrationStarted = (
    <>
      Deine Anmeldung wurde erfolgreich gestartet.
      <br />
      <br />
      Wir haben eine E-Mail an deine Adresse gesendet. In dieser E-Mail findest
      du einen persönlichen Link, um deine Anmeldung bis am{" "}
      <strong>{registrationDeadline}</strong> anzupassen.
    </>
  );
  const days = {
    SATURDAY: "Samstag",
    SUNDAY: "Sonntag",
  } satisfies PerDay<string>;
  return { registrationDeadline, registrationStarted, days };
})();
