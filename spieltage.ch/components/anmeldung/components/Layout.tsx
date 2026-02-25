import type { WithChildren } from "@common/components/utils";
import type { JSX } from "solid-js";
import {
  QuickMenu,
  QuickMenuExtended,
} from "@lst/components/anmeldung/components/QuickMenu";
import type { Roles, SaveState } from "@lst/components/anmeldung/api/meta";

export function Layout(
  props: WithChildren<{
    title?: string;
    showQuickmenu?: boolean;
    roles: Roles;
    saveState: SaveState;
    lastSaved: Date;
    parentPath?: string;
  }>,
): JSX.Element {
  return (
    <div class="page">
      {props.showQuickmenu !== false ? (
        <QuickMenu
          roles={props.roles}
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
            roles={props.roles}
            saveState={props.saveState}
            lastSaved={props.lastSaved}
            parentPath={props.parentPath ?? "/"}
          />
        </div>
      ) : null}
    </div>
  );
}
