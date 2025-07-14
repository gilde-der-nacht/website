import type { WithChildren } from "@common/components/utils";
import type { JSX } from "solid-js/jsx-runtime";
import {
  QuickMenu,
  QuickMenuExtended,
} from "@rst/components/anmeldung/components/QuickMenu";
import type { ChangePageFn } from "@rst/components/anmeldung/Router";
import type { SaveState } from "@rst/components/anmeldung/api/meta";

export function PageTemplate(
  props: WithChildren & {
    title: string;
    showQuickmenu?: boolean;
    changePage: ChangePageFn;
    saveState: SaveState;
    lastSaved: Date;
  },
): JSX.Element {
  return (
    <div class="page">
      {props.showQuickmenu !== false ? (
        <QuickMenu
          changePage={props.changePage}
          saveState={props.saveState}
          lastSaved={props.lastSaved}
        />
      ) : null}
      <div class="page-content">
        <h2>{props.title}</h2>
        <br />
        {props.children}
      </div>
      {props.showQuickmenu !== false ? (
        <div class="extended-wrapper" style="margin-block-start: 1rem;">
          <QuickMenuExtended
            changePage={props.changePage}
            saveState={props.saveState}
            lastSaved={props.lastSaved}
          />
        </div>
      ) : null}
    </div>
  );
}
