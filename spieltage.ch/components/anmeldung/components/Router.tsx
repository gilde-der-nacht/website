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
import type { SaveState } from "@lst/components/anmeldung/api/meta";
import { Layout } from "@lst/components/anmeldung/components/Layout";
import { HelfenDetail } from "@lst/components/anmeldung/pages/HelfenDetail";

export function Router(props: {
  initState: LoadSave;
  secret: string;
}): JSX.Element {
  const [store, setStore] = createStore<{
    meta: { saveState: SaveState; lastSaved: Date };
    save: Save;
  }>({
    meta: {
      saveState: "IDLE",
      lastSaved: new Date(),
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
              link={link}
              saveState={store.meta.saveState}
              lastSaved={store.meta.lastSaved}
            >
              <Root link={link} />
            </Layout>
          ),
        },
        {
          path: "/runden",
          component: () => <Root link={link} />,
        },
        {
          path: "/erstellen",
          component: () => <Root link={link} />,
        },
        {
          path: "/helfen",
          component: () => (
            <Layout
              title="Helfen"
              link={link}
              saveState={store.meta.saveState}
              lastSaved={store.meta.lastSaved}
              showQuickmenu={true}
            >
              <Helfen
                store={store.save}
                isEditable={props.initState.status === "published"}
                link={link}
              />
            </Layout>
          ),
        },
        {
          path: "/helfen/:uuid",
          component: () => (
            <Layout
              link={link}
              saveState={store.meta.saveState}
              lastSaved={store.meta.lastSaved}
              showQuickmenu={true}
              parentPath="/helfen"
            >
              <HelfenDetail
                store={store.save}
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
              link={link}
              saveState={store.meta.saveState}
              lastSaved={store.meta.lastSaved}
              showQuickmenu={true}
            >
              <Zusammenfassung
                store={store.save}
                isEditable={props.initState.status === "published"}
              />
            </Layout>
          ),
        },
      ]}
    </HashRouter>
  );
}
