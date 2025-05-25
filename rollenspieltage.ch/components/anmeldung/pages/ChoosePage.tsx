import type { JSX } from "solid-js";
import { BoxLink } from "@rst/components/anmeldung/components/BoxLink";
import type { ChangePageFn } from "@rst/components/anmeldung/Router";
import type { SaveState } from "@rst/components/anmeldung/api/meta";

export function ChoosePage(props: {
  changePage: ChangePageFn;
  saveState: SaveState;
  lastSaved: Date;
}): JSX.Element {
  return (
    <>
      <BoxLink
        icon="dice-d20"
        onClick={() => props.changePage({ kind: "PLAYER" })}
      >
        <h3>Spielrunden ansehen</h3>
        <p>Melde dich (und deine Freunde) für diverse Spielrunden an.</p>
      </BoxLink>
      <br />
      <BoxLink
        icon="grid-2-plus"
        onClick={() => props.changePage({ kind: "GAMEMASTER" })}
      >
        <h3>Spielrunden erstellen</h3>
        <p>
          Falls du wenig oder gar keine Erfahrung als Spielleiter:in hast,
          werden wir dich vor und während dem Anlass unterstützen.
        </p>
      </BoxLink>
      <br />
      <BoxLink
        icon="hand-heart"
        onClick={() => props.changePage({ kind: "HELPING" })}
      >
        <h3>Helfen</h3>
        <p>
          Beim Kiosk und der Essensausgabe können wir immer ein paar helfende
          Hände gebrauchen.
        </p>
      </BoxLink>
      <br />
      <BoxLink
        icon="list"
        onClick={() => props.changePage({ kind: "SUMMARY" })}
      >
        <h3>Zusammenfassung</h3>
        <p>Erhalte einen Überblick über dein gesamtes Programm.</p>
      </BoxLink>
    </>
  );
}
