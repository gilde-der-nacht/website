import { Show, type JSX } from "solid-js";
import { BoxLink } from "@common/components/BoxLink";
import type { Roles } from "@rst/components/anmeldung/api/meta";
import { RouterLink } from "@common/components/Link";

export function Root(props: { roles: Roles }): JSX.Element {
  return (
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <RouterLink href="/programm" class="button-link">
        <BoxLink icon="dice-d20">
          <h3>Programm ansehen</h3>
          <p>Melde dich (und deine Freunde) für diverse Spielrunden an.</p>
        </BoxLink>
      </RouterLink>
      <Show when={props.roles.includes("editor")}>
        <RouterLink href="/erstellen" class="button-link">
          <BoxLink icon="grid-2-plus">
            <h3>Spielrunde erstellen</h3>
            <p>Erstelle und editiere deine Spielrunden.</p>
          </BoxLink>
        </RouterLink>
      </Show>
      <RouterLink href="/wunschliste" class="button-link">
        <BoxLink icon="message-pen">
          <h3>Wunschliste</h3>
          <p>Deine Wünsche für (zukünftige) Rollenspieltage.</p>
        </BoxLink>
      </RouterLink>
      <RouterLink href="/zusammenfassung" class="button-link">
        <BoxLink icon="list">
          <h3>Zusammenfassung</h3>
          <p>Erhalte einen Überblick über dein gesamtes Programm.</p>
        </BoxLink>
      </RouterLink>
    </div>
  );
}
