import type { WithChildren } from "@common/components/utils";
import type { JSX } from "solid-js";
import {
  QuickMenu,
  QuickMenuExtended,
} from "@lst/components/anmeldung/components/QuickMenu";
import type { SaveState } from "@lst/components/anmeldung/api/meta";

export function Layout(
  props: WithChildren<{
    title?: string;
    showQuickmenu?: boolean;
    link: (path: string) => string;
    saveState: SaveState;
    lastSaved: Date;
    parentPath?: string;
  }>,
): JSX.Element {
  return (
    <div class="page">
      {props.showQuickmenu !== false ? (
        <QuickMenu
          link={props.link}
          saveState={props.saveState}
          lastSaved={props.lastSaved}
          parentPath={props.parentPath ?? "/"}
        />
      ) : null}
      <div class="page-content">
        {props.title === undefined ? null : (
          <>
            <h2>{props.title}</h2>
            <br />
          </>
        )}
        {props.children}
      </div>
      {props.showQuickmenu !== false ? (
        <div class="extended-wrapper" style="margin-block-start: 1rem;">
          <QuickMenuExtended
            link={props.link}
            saveState={props.saveState}
            lastSaved={props.lastSaved}
            parentPath={props.parentPath ?? "/"}
          />
        </div>
      ) : null}
    </div>
  );
}
