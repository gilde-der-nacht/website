export const TXT = (function init() {
  const registrationDeadline = "Freitag, 23. August 2024";
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
  return { registrationDeadline, registrationStarted };
})();
