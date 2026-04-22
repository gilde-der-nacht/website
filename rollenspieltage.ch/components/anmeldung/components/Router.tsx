import { HashRouter } from "@solidjs/router";
import { createResource, createSignal, type JSX } from "solid-js";
import { Root } from "@rst/components/anmeldung/pages/Root";
import {
  debouncedSaveState,
  type LoadSave,
  type Save,
} from "@rst/components/anmeldung/api/save";
import { Helfen } from "@rst/components/anmeldung/pages/Helfen";
import { Zusammenfassung } from "@rst/components/anmeldung/pages/Zusammenfassung";
import { unwrap } from "solid-js/store";
import { toast, ToastContainer } from "@common/components/Toast";
import type { Roles, SaveState } from "@rst/components/anmeldung/api/meta";
import { Layout } from "@rst/components/anmeldung/components/Layout";
import { HelfenDetail } from "@rst/components/anmeldung/pages/HelfenDetail";
import { Box } from "@common/components/Box";
import { TXT } from "@common/utils/texts";
import { Erklaerbaer } from "@rst/components/anmeldung/pages/Erklaerbaer";
import { Programm } from "@rst/components/anmeldung/pages/Programm";
import { Erstellen } from "@rst/components/anmeldung/pages/Erstellen";
import { loadPublic } from "@rst/components/anmeldung/api/public";
import { ErstellenDetail } from "@rst/components/anmeldung/pages/ErstellenDetail";
import { createReactive, obj } from "@common/utils/reactivity";
import { loadAdmin } from "@rst/components/anmeldung/api/admin";
import { HelfenOverview } from "@rst/components/anmeldung/pages/HelfenOverview";
import { ProgrammDetail } from "@rst/components/anmeldung/pages/ProgrammDetail";

export function Router(props: {
  initState: LoadSave;
  secret: string;
}): JSX.Element {
  const [publicResource] = createResource(() => loadPublic(props.secret));
  const [adminResource] = createResource(() => loadAdmin(props.secret));

  const store$ = createReactive<{
    meta: {
      saveState: SaveState;
      lastSaved: Date;
      roles: Roles;
    };
    save: Save;
  }>({
    meta: {
      saveState: "IDLE",
      lastSaved: new Date(),
      roles: props.initState.roles,
    },
    save: props.initState.data,
  });

  const deactivateToastUuid = crypto.randomUUID();
  // hacky solution to not save on first load when nothing has changed yet.
  const [run, setRun] = createSignal(false);
  createResource(
    () => JSON.stringify(store$.get().save),
    async () => {
      if (!run()) {
        setRun(true);
        return;
      }

      if (props.initState.status !== "published") {
        toast(
          "Diese Anmeldung wurde deaktiviert und kann nicht editiert werden.",
          { kind: "danger", uuid: deactivateToastUuid },
        );
        return;
      }

      const newState = unwrap(store$.get().save);

      try {
        const saveResult = await debouncedSaveState(
          store$.get().meta,
          newState,
          props.secret,
        );
        if (saveResult.kind === "FAILURE") {
          console.error(saveResult);
        } else {
          store$
            .pipe(obj.sub("meta"))
            .pipe(obj.sub("lastSaved"))
            .set(saveResult.data);
        }
      } catch (e) {
        console.error(e);
        store$.pipe(obj.sub("meta")).pipe(obj.sub("saveState")).set("ERROR");
      }
    },
  );

  return (
    <>
      <HashRouter explicitLinks={true}>
        {[
          {
            path: "/",
            component: () => (
              <Layout
                title="Wo möchtest du starten?"
                roles={store$.get().meta.roles}
                saveState={store$.get().meta.saveState}
                lastSaved={store$.get().meta.lastSaved}
                publicResource={publicResource}
                adminResource={adminResource}
              >
                <Root roles={store$.get().meta.roles} />
              </Layout>
            ),
          },
          {
            path: "/programm",
            component: () => (
              <Layout
                title="Programm"
                roles={store$.get().meta.roles}
                saveState={store$.get().meta.saveState}
                lastSaved={store$.get().meta.lastSaved}
                publicResource={publicResource}
                adminResource={adminResource}
              >
                {({ publicData }) => (
                  <Programm
                    save$={store$.pipe(obj.sub("save"))}
                    publicData={publicData}
                  />
                )}
              </Layout>
            ),
          },
          {
            path: "/programm/:uuid",
            component: () => (
              <Layout
                roles={store$.get().meta.roles}
                saveState={store$.get().meta.saveState}
                lastSaved={store$.get().meta.lastSaved}
                showQuickmenu={true}
                parentPath="/programm"
                publicResource={publicResource}
                adminResource={adminResource}
              >
                {({ publicData, adminData }) => (
                  <ProgrammDetail
                    reservations$={store$
                      .pipe(obj.sub("save"))
                      .pipe(obj.sub("program"))
                      .pipe(obj.sub("participating"))}
                    publicData={publicData}
                    adminData={adminData}
                    isEditable={props.initState.status === "published"}
                  />
                )}
              </Layout>
            ),
          },
          {
            path: "/erstellen",
            component: () => (
              <Layout
                title="Programmpunkte erstellen und editieren"
                roles={store$.get().meta.roles}
                saveState={store$.get().meta.saveState}
                lastSaved={store$.get().meta.lastSaved}
                publicResource={publicResource}
                adminResource={adminResource}
              >
                <Erstellen
                  programEntries$={store$
                    .pipe(obj.sub("save"))
                    .pipe(obj.sub("program"))
                    .pipe(obj.sub("organising"))}
                  isEditable={props.initState.status === "published"}
                />
              </Layout>
            ),
          },

          {
            path: "/erstellen/:uuid",
            component: () => (
              <Layout
                roles={store$.get().meta.roles}
                saveState={store$.get().meta.saveState}
                lastSaved={store$.get().meta.lastSaved}
                parentPath="/erstellen"
                publicResource={publicResource}
                adminResource={adminResource}
              >
                <ErstellenDetail
                  programEntries$={store$
                    .pipe(obj.sub("save"))
                    .pipe(obj.sub("program"))
                    .pipe(obj.sub("organising"))}
                  isEditable={props.initState.status === "published"}
                />
              </Layout>
            ),
          },
          {
            path: "/helfen",
            component: () => (
              <Layout
                title="Helfen"
                roles={store$.get().meta.roles}
                saveState={store$.get().meta.saveState}
                lastSaved={store$.get().meta.lastSaved}
                showQuickmenu={true}
                publicResource={publicResource}
                adminResource={adminResource}
              >
                {({ publicData }) => (
                  <Helfen
                    reservations$={store$
                      .pipe(obj.sub("save"))
                      .pipe(obj.sub("helping"))}
                    publicData={publicData}
                    isEditable={props.initState.status === "published"}
                    roles={store$.get().meta.roles}
                  />
                )}
              </Layout>
            ),
          },
          {
            path: "/helfen/:uuid",
            component: () => (
              <Layout
                roles={store$.get().meta.roles}
                saveState={store$.get().meta.saveState}
                lastSaved={store$.get().meta.lastSaved}
                showQuickmenu={true}
                parentPath="/helfen"
                publicResource={publicResource}
                adminResource={adminResource}
              >
                {({ publicData, adminData }) => (
                  <HelfenDetail
                    reservations$={store$
                      .pipe(obj.sub("save"))
                      .pipe(obj.sub("helping"))}
                    publicData={publicData}
                    adminData={adminData}
                    isEditable={props.initState.status === "published"}
                  />
                )}
              </Layout>
            ),
          },
          {
            path: "/erklaerbaer",
            component: () => (
              <Layout
                title="Helfen: Erklärbären"
                roles={store$.get().meta.roles}
                saveState={store$.get().meta.saveState}
                lastSaved={store$.get().meta.lastSaved}
                showQuickmenu={true}
                parentPath="/helfen"
                publicResource={publicResource}
                adminResource={adminResource}
              >
                {({ adminData }) => (
                  <Erklaerbaer
                    save$={store$.pipe(obj.sub("save"))}
                    adminData={adminData}
                    roles={store$.get().meta.roles}
                    isEditable={props.initState.status === "published"}
                  />
                )}
              </Layout>
            ),
          },
          {
            path: "/helfen/admin",
            component: () => (
              <Layout
                title="Helfer-Übersicht"
                roles={store$.get().meta.roles}
                saveState={store$.get().meta.saveState}
                lastSaved={store$.get().meta.lastSaved}
                showQuickmenu={true}
                parentPath="/helfen"
                publicResource={publicResource}
                adminResource={adminResource}
              >
                {({ adminData }) => (
                  <HelfenOverview
                    reservations$={store$
                      .pipe(obj.sub("save"))
                      .pipe(obj.sub("helping"))}
                    adminData={adminData}
                    roles={store$.get().meta.roles}
                  />
                )}
              </Layout>
            ),
          },
          {
            path: "/zusammenfassung",
            component: () => (
              <Layout
                title="Zusammenfassung"
                roles={store$.get().meta.roles}
                saveState={store$.get().meta.saveState}
                lastSaved={store$.get().meta.lastSaved}
                showQuickmenu={true}
                publicResource={publicResource}
                adminResource={adminResource}
              >
                {({ publicData }) => (
                  <Zusammenfassung
                    save$={store$.pipe(obj.sub("save"))}
                    publicData={publicData}
                    isEditable={props.initState.status === "published"}
                  />
                )}
              </Layout>
            ),
          },
          {
            path: "*",
            component: () => {
              return (
                <Layout
                  title="Seite nicht gefunden"
                  roles={store$.get().meta.roles}
                  saveState={store$.get().meta.saveState}
                  lastSaved={store$.get().meta.lastSaved}
                  showQuickmenu={true}
                  publicResource={publicResource}
                  adminResource={adminResource}
                >
                  <Box type="danger">{TXT.error.siteNotFound}</Box>
                </Layout>
              );
            },
          },
        ]}
      </HashRouter>
      <ToastContainer />
    </>
  );
}
