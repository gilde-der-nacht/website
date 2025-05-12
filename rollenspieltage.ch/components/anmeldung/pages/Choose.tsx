import type { JSX } from "solid-js";
import type { Page } from "../load";
import { BoxLink } from "../components/BoxLink";
import { PageTemplate } from "./PageTemplate";

export function ChoosePage(props: {
  changePage: (page: Page) => void;
}): JSX.Element {
  return (
    <PageTemplate
      title="Wo möchtest du starten?"
      showQuickmenu={false}
      changePage={props.changePage}
    >
      <BoxLink icon="dice-d20" onClick={() => props.changePage("PLAYER")}>
        <h3>Spielrunden ansehen</h3>
        <p>Melde dich (und deine Freunde) für diverse Spielrunden an.</p>
      </BoxLink>
      <br />
      <BoxLink
        icon="grid-2-plus"
        onClick={() => props.changePage("GAMEMASTER")}
      >
        <h3>Spielrunden erstellen</h3>
        <p>
          Falls du wenig oder gar keine Erfahrung als Spielleiter:in hast,
          werden wir dich vor und während dem Anlass unterstützen.
        </p>
      </BoxLink>
      <br />
      <BoxLink icon="hand-heart" onClick={() => props.changePage("HELPING")}>
        <h3>Helfen</h3>
        <p>
          Beim Kiosk und der Essensausgabe können wir immer ein paar helfende
          Hände gebrauchen.
        </p>
      </BoxLink>
      <br />
      <BoxLink icon="list" onClick={() => props.changePage("SUMMARY")}>
        <h3>Zusammenfassung</h3>
        <p>Erhalte einen Überblick über dein gesamtes Programm.</p>
      </BoxLink>
    </PageTemplate>
  );
}
