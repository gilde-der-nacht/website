import { HashRouter } from "@solidjs/router";
import { createResource, createSignal, type JSX } from "solid-js";
import { Root } from "@rst/components/anmeldung/pages/Root";
import {
  debouncedSaveState,
  type LoadSave,
  type Save,
} from "@rst/components/anmeldung/api/save";
import { Zusammenfassung } from "@rst/components/anmeldung/pages/Zusammenfassung";
import { unwrap } from "solid-js/store";
import { toast, ToastContainer } from "@common/components/Toast";
import type { Roles, SaveState } from "@rst/components/anmeldung/api/meta";
import { Layout } from "@rst/components/anmeldung/components/Layout";
import { Box } from "@common/components/Box";
import { TXT } from "@common/utils/texts";
import { Programm } from "@rst/components/anmeldung/pages/Programm";
import { Erstellen } from "@rst/components/anmeldung/pages/Erstellen";
import { ErstellenDetail } from "@rst/components/anmeldung/pages/ErstellenDetail";
import { createReactive, obj } from "@common/utils/reactivity";
import { ProgrammDetail } from "@rst/components/anmeldung/pages/ProgrammDetail";
import { loadProgram } from "@rst/components/anmeldung/api/program";
import { unsafeToToastUuid, type RegistrationUuid } from "@common/utils/ids";
import { Wunschliste } from "@rst/components/anmeldung/pages/Wunschliste";

export function Router(props: {
  initState: LoadSave;
  secret: RegistrationUuid;
}): JSX.Element {
  const [programResource, { refetch }] = createResource(() =>
    loadProgram(props.secret),
  );

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

  const deactivateToastUuid = unsafeToToastUuid(crypto.randomUUID());
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

      let successful = false;
      try {
        const saveResult = await debouncedSaveState(
          store$.get().meta,
          newState,
          props.secret,
        );
        if (saveResult.kind === "FAILURE") {
          console.error(saveResult);
        } else {
          successful = true;
          store$
            .pipe(obj.sub("meta"))
            .pipe(obj.sub("lastSaved"))
            .set(saveResult.data);
        }
      } catch (e) {
        console.error(e);
        store$.pipe(obj.sub("meta")).pipe(obj.sub("saveState")).set("ERROR");
      }

      if (successful) {
        await refetch();
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
                title={`Wo möchtest du starten, ${store$.get().save.contact.name}?`}
                store$={store$}
                programResource={programResource}
                secret={props.secret}
              >
                {() => <Root roles={store$.get().meta.roles} />}
              </Layout>
            ),
          },
          {
            path: "/programm",
            component: () => (
              <Layout
                title="Programm"
                store$={store$}
                programResource={programResource}
                secret={props.secret}
              >
                {({ programData }) => (
                  <Programm
                    save$={store$.pipe(obj.sub("save"))}
                    programData={programData}
                    roles={store$.get().meta.roles}
                    secret={props.secret}
                  />
                )}
              </Layout>
            ),
          },
          {
            path: "/programm/:uuid",
            component: () => (
              <Layout
                store$={store$}
                showQuickmenu={true}
                parentPath="/programm"
                secret={props.secret}
                programResource={programResource}
              >
                {({ programData }) => (
                  <ProgrammDetail
                    reservations$={store$
                      .pipe(obj.sub("save"))
                      .pipe(obj.sub("program"))
                      .pipe(obj.sub("reserveActions"))}
                    programData={programData}
                    isEditable={props.initState.status === "published"}
                    secret={props.secret}
                    roles={store$.get().meta.roles}
                  />
                )}
              </Layout>
            ),
          },
          {
            path: "/erstellen",
            component: () => (
              <Layout
                title="Spielrunden erstellen und editieren"
                store$={store$}
                programResource={programResource}
                secret={props.secret}
              >
                {() => (
                  <Erstellen
                    programEntries$={store$
                      .pipe(obj.sub("save"))
                      .pipe(obj.sub("program"))
                      .pipe(obj.sub("organising"))}
                    isEditable={props.initState.status === "published"}
                  />
                )}
              </Layout>
            ),
          },

          {
            path: "/erstellen/:uuid",
            component: () => (
              <Layout
                store$={store$}
                parentPath="/erstellen"
                programResource={programResource}
                secret={props.secret}
              >
                {({ programData }) => (
                  <ErstellenDetail
                    programEntries$={store$
                      .pipe(obj.sub("save"))
                      .pipe(obj.sub("program"))
                      .pipe(obj.sub("organising"))}
                    contact$={store$
                      .pipe(obj.sub("save"))
                      .pipe(obj.sub("contact"))}
                    programData={programData}
                    isEditable={props.initState.status === "published"}
                    roles={store$.get().meta.roles}
                  />
                )}
              </Layout>
            ),
          },
          {
            path: "/wunschliste",
            component: () => (
              <Layout
                title="Wunschliste"
                store$={store$}
                showQuickmenu={true}
                secret={props.secret}
                programResource={programResource}
              >
                {({ programData }) => (
                  <Wunschliste
                    wishlist$={store$
                      .pipe(obj.sub("save"))
                      .pipe(obj.sub("wishlist"))}
                    programData={programData}
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
                store$={store$}
                showQuickmenu={true}
                secret={props.secret}
                programResource={programResource}
              >
                {({ programData }) => (
                  <Zusammenfassung
                    save$={store$.pipe(obj.sub("save"))}
                    programData={programData}
                    secret={props.secret}
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
                  store$={store$}
                  showQuickmenu={true}
                  secret={props.secret}
                  programResource={programResource}
                >
                  {() => <Box type="danger">{TXT.error.siteNotFound}</Box>}
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
