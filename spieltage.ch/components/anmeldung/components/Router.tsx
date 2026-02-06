import { HashRouter } from "@solidjs/router";
import { createResource, createSignal, type JSX } from "solid-js";
import { Root } from "@lst/components/anmeldung/pages/Root";
import {
  debouncedSaveState,
  type LoadSave,
  type Save,
} from "@lst/components/anmeldung/api/save";
import { Helfen } from "@lst/components/anmeldung/pages/Helfen";
import { Zusammenfassung } from "@lst/components/anmeldung/pages/Zusammenfassung";
import { createStore, unwrap } from "solid-js/store";
import { toast } from "@common/components/Toast";
import type { Roles, SaveState } from "@lst/components/anmeldung/api/meta";
import { Layout } from "@lst/components/anmeldung/components/Layout";
import { HelfenDetail } from "@lst/components/anmeldung/pages/HelfenDetail";
import { Box } from "@common/components/Box";
import { TXT } from "@common/utils/texts";
import { Erklaerbaer } from "@lst/components/anmeldung/pages/Erklaerbaer";
import { Programm } from "@lst/components/anmeldung/pages/Programm";
import { Erstellen } from "@lst/components/anmeldung/pages/Erstellen";
import { loadPublic } from "../api/public";

export function Router(props: {
  initState: LoadSave;
  secret: string;
}): JSX.Element {
  const [publicResource] = createResource(loadPublic);

  const [store, setStore] = createStore<{
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
    () => JSON.stringify(store.save),
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

      const newState = unwrap(store.save);

      try {
        const saveResult = await debouncedSaveState(
          store.meta,
          newState,
          props.secret,
        );
        if (saveResult.kind === "FAILURE") {
          console.error(saveResult);
        } else {
          setStore("meta", "lastSaved", saveResult.data);
        }
      } catch (e) {
        console.error(e);
        setStore("meta", "saveState", "ERROR");
      }
    },
  );

  function link(path: string): string {
    return `${path}?secret=${props.secret}`;
  }

  return (
    <HashRouter>
      {[
        {
          path: "/",
          component: () => (
            <Layout
              title="Wo möchtest du starten?"
              roles={store.meta.roles}
              link={link}
              saveState={store.meta.saveState}
              lastSaved={store.meta.lastSaved}
            >
              <Root roles={store.meta.roles} link={link} />
            </Layout>
          ),
        },
        {
          path: "/programm",
          component: () => (
            <Layout
              title="Programm"
              roles={store.meta.roles}
              link={link}
              saveState={store.meta.saveState}
              lastSaved={store.meta.lastSaved}
            >
              <Programm />
            </Layout>
          ),
        },
        {
          path: "/erstellen",
          component: () => (
            <Layout
              title="Programmpunkte erstellen und editieren"
              roles={store.meta.roles}
              link={link}
              saveState={store.meta.saveState}
              lastSaved={store.meta.lastSaved}
            >
              <Erstellen />
            </Layout>
          ),
        },
        {
          path: "/helfen",
          component: () => (
            <Layout
              title="Helfen"
              roles={store.meta.roles}
              link={link}
              saveState={store.meta.saveState}
              lastSaved={store.meta.lastSaved}
              showQuickmenu={true}
            >
              <Helfen
                store={store.save}
                publicResource={publicResource}
                isEditable={props.initState.status === "published"}
                link={link}
                roles={store.meta.roles}
              />
            </Layout>
          ),
        },
        {
          path: "/helfen/:uuid",
          component: () => (
            <Layout
              link={link}
              roles={store.meta.roles}
              saveState={store.meta.saveState}
              lastSaved={store.meta.lastSaved}
              showQuickmenu={true}
              parentPath="/helfen"
            >
              <HelfenDetail
                store={store.save}
                publicResource={publicResource}
                link={link}
                isEditable={props.initState.status === "published"}
              />
            </Layout>
          ),
        },
        {
          path: "/erklaerbaer",
          component: () => (
            <Layout
              title="Helfen: Erklärbären"
              roles={store.meta.roles}
              link={link}
              saveState={store.meta.saveState}
              lastSaved={store.meta.lastSaved}
              showQuickmenu={true}
              parentPath="/helfen"
            >
              <Erklaerbaer
                store={store.save}
                roles={store.meta.roles}
                isEditable={props.initState.status === "published"}
              />
            </Layout>
          ),
        },
        {
          path: "/zusammenfassung",
          component: () => (
            <Layout
              title="Zusammenfassung"
              roles={store.meta.roles}
              link={link}
              saveState={store.meta.saveState}
              lastSaved={store.meta.lastSaved}
              showQuickmenu={true}
            >
              <Zusammenfassung
                store={store.save}
                publicResource={publicResource}
                link={link}
                isEditable={props.initState.status === "published"}
              />
            </Layout>
          ),
        },
        {
          path: "*",
          component: () => (
            <Layout
              title="Seite nicht gefunden"
              roles={store.meta.roles}
              link={link}
              saveState={store.meta.saveState}
              lastSaved={store.meta.lastSaved}
              showQuickmenu={true}
            >
              <Box type="danger">{TXT.error.siteNotFound}</Box>
            </Layout>
          ),
        },
      ]}
    </HashRouter>
  );
}
