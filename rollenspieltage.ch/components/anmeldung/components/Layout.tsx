import { Suspense, type JSX, type Resource } from "solid-js";
import {
  QuickMenu,
  QuickMenuExtended,
} from "@rst/components/anmeldung/components/QuickMenu";
import type { Roles, SaveState } from "@rst/components/anmeldung/api/meta";
import type { Result } from "@rst/components/anmeldung/api/elysium";
import { ShowProgramData } from "@rst/components/anmeldung/components/Loader";
import { Box } from "@common/components/Box";
import { TXT } from "@common/utils/texts";
import type { Program } from "@rst/components/anmeldung/api/program";

export function Layout(props: {
  title?: string;
  showQuickmenu?: boolean;
  roles: Roles;
  saveState: SaveState;
  lastSaved: Date;
  parentPath?: string;
  programResource: Resource<Result<Program>>;
  children: JSX.Element | ((data: { programData: Program }) => JSX.Element);
}): JSX.Element {
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
        <Suspense fallback={<Box>{TXT.loading.program}</Box>}>
          <ShowProgramData programResource={props.programResource}>
            {(programData) =>
              typeof props.children === "function"
                ? props.children({ programData })
                : props.children
            }
          </ShowProgramData>
        </Suspense>
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
