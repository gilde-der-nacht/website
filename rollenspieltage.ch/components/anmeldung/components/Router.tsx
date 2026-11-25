import { createRouter, hashHistory } from "@solidjs/router";
import {
  createEffect,
  createMemo,
  createSignal,
  refresh,
  Show,
  snapshot,
  type Accessor,
} from "solid-js";
import type { JSX } from "@solidjs/web";
import { Root } from "@rst/components/anmeldung/pages/Root";
import {
  debouncedSaveState,
  type LoadSave,
  type Save,
} from "@rst/components/anmeldung/api/save";
import { Zusammenfassung } from "@rst/components/anmeldung/pages/Zusammenfassung";
import { toast, ToastContainer } from "@common/components/Toast";
import type { Roles, SaveState } from "@rst/components/anmeldung/api/meta";
import { Layout } from "@rst/components/anmeldung/components/Layout";
import { Box } from "@common/components/Box";
import { TXT } from "@common/utils/texts";
import { Programm } from "@rst/components/anmeldung/pages/Programm";
import { Erstellen } from "@rst/components/anmeldung/pages/Erstellen";
import { ErstellenDetail } from "@rst/components/anmeldung/pages/ErstellenDetail";
import { createReactive, type Reactive } from "@common/utils/reactivity";
import { ProgrammDetail } from "@rst/components/anmeldung/pages/ProgrammDetail";
import {
  loadProgram,
  type Program,
} from "@rst/components/anmeldung/api/program";
import { unsafeToToastUuid, type RegistrationUuid } from "@common/utils/ids";
import { Wunschliste } from "@rst/components/anmeldung/pages/Wunschliste";
import { Portal } from "@solidjs/web";
import { ShowProgramData } from "@rst/components/anmeldung/components/Loader";

export type AppStore = {
  meta: {
    saveState: SaveState;
    lastSaved: Date;
    roles: Roles;
    showLoading: boolean;
  };
  save: Save;
};

function HashRouter(props: {
  store$: Reactive<AppStore>;
  secret: RegistrationUuid;
  programData: Accessor<Program>;
  initState: LoadSave;
}): JSX.Element {
  const R = createRouter({
    routes: [
      {
        path: "/",
        component: () => (
          <Layout
            title={`Wo möchtest du starten, ${props.store$.get().save.contact.name}?`}
            store$={props.store$}
            programData={props.programData}
            secret={props.secret}
          >
            <Root roles={props.store$.get().meta.roles} />
          </Layout>
        ),
      },
      {
        path: "/programm",
        component: () => (
          <Layout
            title="Programm"
            store$={props.store$}
            programData={props.programData}
            secret={props.secret}
          >
            <Programm
              save$={props.store$.sub("save")}
              programData={props.programData}
              roles={props.store$.get().meta.roles}
              secret={props.secret}
            />
          </Layout>
        ),
      },
      {
        path: "/programm/:uuid",
        component: () => (
          <Layout
            store$={props.store$}
            showQuickmenu={true}
            parentPath="/programm"
            secret={props.secret}
            programData={props.programData}
          >
            <ProgrammDetail
              reservations$={props.store$
                .sub("save")
                .sub("program")
                .sub("reserveActions")}
              programData={props.programData}
              isEditable={props.initState.status === "published"}
              secret={props.secret}
              roles={props.store$.get().meta.roles}
              showLoading$={props.store$.sub("meta").sub("showLoading")}
            />
          </Layout>
        ),
      },
      {
        path: "/erstellen",
        component: () => (
          <Layout
            title="Spielrunden erstellen und editieren"
            store$={props.store$}
            programData={props.programData}
            secret={props.secret}
          >
            <Erstellen
              programEntries$={props.store$
                .sub("save")
                .sub("program")
                .sub("organising")}
              isEditable={props.initState.status === "published"}
            />
          </Layout>
        ),
      },
      {
        path: "/erstellen/:uuid",
        component: () => (
          <Layout
            store$={props.store$}
            parentPath="/erstellen"
            programData={props.programData}
            secret={props.secret}
          >
            <ErstellenDetail
              programEntries$={props.store$
                .sub("save")
                .sub("program")
                .sub("organising")}
              contact$={props.store$.sub("save").sub("contact")}
              programData={props.programData}
              isEditable={props.initState.status === "published"}
              roles={props.store$.get().meta.roles}
            />
          </Layout>
        ),
      },
      {
        path: "/wunschliste",
        component: () => (
          <Layout
            title="Wunschliste"
            store$={props.store$}
            showQuickmenu={true}
            secret={props.secret}
            programData={props.programData}
          >
            <Wunschliste
              wishlist$={props.store$.sub("save").sub("wishlist")}
              programData={props.programData}
              roles={props.store$.get().meta.roles}
            />
          </Layout>
        ),
      },
      {
        path: "/zusammenfassung",
        component: () => (
          <Layout
            title="Zusammenfassung"
            store$={props.store$}
            showQuickmenu={true}
            secret={props.secret}
            programData={props.programData}
          >
            <Zusammenfassung
              save$={props.store$.sub("save")}
              programData={props.programData}
              secret={props.secret}
              isEditable={props.initState.status === "published"}
            />
          </Layout>
        ),
      },
      {
        path: "*",
        component: () => {
          return (
            <Layout
              title="Seite nicht gefunden"
              store$={props.store$}
              showQuickmenu={true}
              secret={props.secret}
              programData={props.programData}
            >
              <Box type="danger">{TXT.error.siteNotFound}</Box>
            </Layout>
          );
        },
      },
    ],
    history: hashHistory(),
    explicitLinks: true,
  });

  return <R />;
}

export function Router(props: {
  initState: LoadSave;
  secret: RegistrationUuid;
}): JSX.Element {
  const programResource = createMemo(() => loadProgram(props.secret));

  const store$ = createReactive<AppStore>({
    meta: {
      saveState: "IDLE",
      lastSaved: new Date(),
      roles: props.initState.roles,
      showLoading: false,
    },
    save: props.initState.data,
  });

  const deactivateToastUuid = unsafeToToastUuid(crypto.randomUUID());
  // hacky solution to not save on first load when nothing has changed yet.
  const [run, setRun] = createSignal(false);
  createEffect(
    () => JSON.stringify(store$.get().save),
    () => {
      (async () => {
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

        const newState = snapshot(store$.get().save);

        let successful = false;
        try {
          store$.sub("meta").sub("showLoading").set(true);
          const saveResult = await debouncedSaveState(
            store$.get().meta,
            newState,
            props.secret,
          );
          if (saveResult.kind === "FAILURE") {
            console.error(saveResult);
          } else {
            successful = true;
            store$.sub("meta").sub("lastSaved").set(saveResult.data);
          }
        } catch (e) {
          console.error(e);
          store$.sub("meta").sub("saveState").set("ERROR");
        }

        if (successful) {
          await refresh(programResource);
          store$.sub("meta").sub("showLoading").set(false);
        }
      })();
    },
  );

  const portalRef: Element | undefined =
    document.querySelector(".portal-container") ?? undefined;

  return (
    <>
      <Show when={portalRef}>
        {(portal) => (
          <Portal mount={portal()}>
            <strong>
              <em>{store$.get().save.contact.name}</em>
            </strong>
          </Portal>
        )}
      </Show>

      <ShowProgramData programResource={programResource}>
        {(programData) => (
          <HashRouter
            store$={store$}
            secret={props.secret}
            initState={props.initState}
            programData={programData}
          />
        )}
      </ShowProgramData>
      <ToastContainer />
    </>
  );
}
