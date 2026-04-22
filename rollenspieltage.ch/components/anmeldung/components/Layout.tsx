import { Suspense, type JSX, type Resource } from "solid-js";
import {
  QuickMenu,
  QuickMenuExtended,
} from "@rst/components/anmeldung/components/QuickMenu";
import type { Roles, SaveState } from "@rst/components/anmeldung/api/meta";
import type { PublicAdmin } from "@rst/components/anmeldung/api/admin";
import type { Public } from "@rst/components/anmeldung/api/public";
import type { Result } from "@rst/components/anmeldung/api/elysium";
import {
  ShowAdminData,
  ShowPublicData,
} from "@rst/components/anmeldung/components/Loader";
import { Box } from "@common/components/Box";
import { TXT } from "@common/utils/texts";

export function Layout(props: {
  title?: string;
  showQuickmenu?: boolean;
  roles: Roles;
  saveState: SaveState;
  lastSaved: Date;
  parentPath?: string;
  publicResource: Resource<Result<Public>>;
  adminResource: Resource<Result<PublicAdmin>>;
  children:
    | JSX.Element
    | ((data: { publicData: Public; adminData: PublicAdmin }) => JSX.Element);
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
          <ShowPublicData publicResource={props.publicResource}>
            {(publicData) => (
              <ShowAdminData adminResource={props.adminResource}>
                {(adminData) =>
                  typeof props.children === "function"
                    ? props.children({ publicData, adminData })
                    : props.children
                }
              </ShowAdminData>
            )}
          </ShowPublicData>
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
