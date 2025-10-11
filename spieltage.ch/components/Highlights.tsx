import { Icon } from "@common/components/Icon";
import { type JSX } from "solid-js";

export function Highlights(): JSX.Element {
  return (
    <div>
      <ul class="info" role="list">
        <li>
          <Icon icon="calendar-days" /> 14. + 15. März 2026
        </li>
        <li>
          <Icon icon="ticket-simple" /> Eintritt kostenfrei
        </li>
        <li>
          <Icon icon="location-smile" /> Schädrütistrasse 26, Luzern
        </li>
      </ul>
      <ul class="highlights" role="list">
        <li>Freies Spielen</li>
        <li>Organisierte Spiele</li>
        <li>Flohmarkt</li>
        <li>Verpflegung</li>
        <li>Familiensonntag</li>
        <li>Spieldesigner</li>
      </ul>
      <ul class="actions" role="list">
        <li>
          <Icon icon="list-radio" /> Programm entdecken
        </li>
        <li>
          <Icon icon="hand-heart" /> Unterstütze uns
        </li>
        <li>
          <Icon icon="mailbox" /> Schreib uns eine Nachricht
        </li>
      </ul>
    </div>
  );
}
