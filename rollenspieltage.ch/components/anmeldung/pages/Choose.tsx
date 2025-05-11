import { Box } from "@common/components/Box";
import type { JSX } from "solid-js";
import type { Page } from "../load";

export function ChoosePage(props: {
  changePage: (page: Page) => void;
}): JSX.Element {
  return (
    <div class="choose">
      <Box type="special" onClick={() => props.changePage("PLAYER")}>
        <div class="grid">
          <i class="fa-duotone fa-dice-d20"></i>
          <div>
            <h3>Spielrunden ansehen</h3>
            <p>Melde dich (und deine Freunde) für diverse Spielrunden an.</p>
          </div>
        </div>
      </Box>
      <br />
      <Box type="special" onClick={() => props.changePage("GAMEMASTER")}>
        <div class="grid">
          <i class="fa-duotone fa-grid-2-plus"></i>
          <div>
            <h3>Spielrunden erstellen</h3>
            <p>
              Falls du wenig oder gar keine Erfahrung als Spielleiter:in hast,
              werden wir dich vor und während dem Anlass unterstützen.
            </p>
          </div>
        </div>
      </Box>
      <br />
      <Box type="special" onClick={() => props.changePage("HELPING")}>
        <div class="grid">
          <i class="fa-duotone fa-hand-heart"></i>
          <div>
            <h3>Helfen</h3>
            <p>
              Beim Kiosk und der Essensausgabe können wir immer ein paar
              helfende Hände gebrauchen.
            </p>
          </div>
        </div>
      </Box>
    </div>
  );
}
