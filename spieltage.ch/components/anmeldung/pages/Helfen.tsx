import type { JSX } from "solid-js";
import { Icon } from "@common/components/Icon";

export function Helfen(): JSX.Element {
  return (
    <p>
      Beim Kiosk und der Essensausgabe können wir immer ein paar helfende Hände
      gebrauchen. Wenn du bereit bist zu helfen, klicke in der jeweiligen Stunde
      auf das Handsymbol <Icon icon="hand-heart" />.
    </p>
  );
}
