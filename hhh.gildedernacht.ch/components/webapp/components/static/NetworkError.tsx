import { Notification } from "@hhh/components/webapp/components/static/Notification";

export const NetworkError = () => (
  <Notification kind="danger">
    <div class="content">
      <p>
        Leider ist ein <strong>Netzwerk-Fehler</strong> aufgetreten. Versuche
        die Seite neuzuladen.
      </p>
      <p>
        Erhältst du den Fehler erneut, schreibe uns bitte eine Nachricht per{" "}
        <a
          href="https://gildedernacht.ch/kontakt/"
          target="_blank"
          rel="noopener"
        >
          Kontaktformular
        </a>
        .
      </p>
    </div>
  </Notification>
);
