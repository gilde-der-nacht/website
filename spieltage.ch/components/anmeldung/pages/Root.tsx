import type { JSX } from "solid-js";
import { BoxLink } from "@common/components/BoxLink";
import { A } from "@solidjs/router";

export function Root(props: { link: (path: string) => string }): JSX.Element {
  return (
    <div>
      {/*
        <A href={props.link("/runden")} class="button-link">
          <BoxLink icon="dice-d20">
            <h3>Spielrunden ansehen</h3>
            <p>Melde dich (und deine Freunde) für diverse Spielrunden an.</p>
          </BoxLink>
        </A>
         <br />
         <A href={props.link("/erstellen")} class="button-link">
           <BoxLink icon="grid-2-plus">
             <h3>Spielrunden erstellen</h3>
             <p>
               Falls du wenig oder gar keine Erfahrung als Spielleiter:in hast,
               werden wir dich vor und während dem Anlass unterstützen.
             </p>
           </BoxLink>
         </A>
        <br />
      */}
      <A href={props.link("/helfen")} class="button-link">
        <BoxLink icon="hand-heart">
          <h3>Helfen</h3>
          <p>
            Beim Kiosk und der Essensausgabe können wir immer ein paar helfende
            Hände gebrauchen.
          </p>
        </BoxLink>
      </A>
      <br />
      <A href={props.link("/zusammenfassung")} class="button-link">
        <BoxLink icon="list">
          <h3>Zusammenfassung</h3>
          <p>Erhalte einen Überblick über dein gesamtes Programm.</p>
        </BoxLink>
      </A>
    </div>
  );
}
