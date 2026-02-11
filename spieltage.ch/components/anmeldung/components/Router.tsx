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
import { unwrap } from "solid-js/store";
import { toast } from "@common/components/Toast";
import type { Roles, SaveState } from "@lst/components/anmeldung/api/meta";
import { Layout } from "@lst/components/anmeldung/components/Layout";
import { HelfenDetail } from "@lst/components/anmeldung/pages/HelfenDetail";
import { Box } from "@common/components/Box";
import { TXT } from "@common/utils/texts";
import { Erklaerbaer } from "@lst/components/anmeldung/pages/Erklaerbaer";
import { Programm } from "@lst/components/anmeldung/pages/Programm";
import { Erstellen } from "@lst/components/anmeldung/pages/Erstellen";
import { loadPublic } from "@lst/components/anmeldung/api/public";
import { ErstellenDetail } from "@lst/components/anmeldung/pages/ErstellenDetail";
import { createReactive, obj } from "@common/utils/reactivity";

export function Router(props: {
  initState: LoadSave;
  secret: string;
}): JSX.Element {
  const [publicResource] = createResource(loadPublic);

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
              roles={store$.get().meta.roles}
              link={link}
              saveState={store$.get().meta.saveState}
              lastSaved={store$.get().meta.lastSaved}
            >
              <Root roles={store$.get().meta.roles} link={link} />
            </Layout>
          ),
        },
        {
          path: "/programm",
          component: () => (
            <Layout
              title="Programm"
              roles={store$.get().meta.roles}
              link={link}
              saveState={store$.get().meta.saveState}
              lastSaved={store$.get().meta.lastSaved}
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
              roles={store$.get().meta.roles}
              link={link}
              saveState={store$.get().meta.saveState}
              lastSaved={store$.get().meta.lastSaved}
            >
              <Erstellen
                programEntries$={store$
                  .pipe(obj.sub("save"))
                  .pipe(obj.sub("program"))
                  .pipe(obj.sub("organising"))}
                publicResource={publicResource}
                link={link}
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
              link={link}
              saveState={store$.get().meta.saveState}
              lastSaved={store$.get().meta.lastSaved}
              parentPath="/erstellen"
            >
              <ErstellenDetail
                programEntries$={store$
                  .pipe(obj.sub("save"))
                  .pipe(obj.sub("program"))
                  .pipe(obj.sub("organising"))}
                publicResource={publicResource}
                link={link}
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
              link={link}
              saveState={store$.get().meta.saveState}
              lastSaved={store$.get().meta.lastSaved}
              showQuickmenu={true}
            >
              <Helfen
                reservations$={store$
                  .pipe(obj.sub("save"))
                  .pipe(obj.sub("helping"))}
                publicResource={publicResource}
                isEditable={props.initState.status === "published"}
                link={link}
                roles={store$.get().meta.roles}
              />
            </Layout>
          ),
        },
        {
          path: "/helfen/:uuid",
          component: () => (
            <Layout
              link={link}
              roles={store$.get().meta.roles}
              saveState={store$.get().meta.saveState}
              lastSaved={store$.get().meta.lastSaved}
              showQuickmenu={true}
              parentPath="/helfen"
            >
              <HelfenDetail
                reservations$={store$
                  .pipe(obj.sub("save"))
                  .pipe(obj.sub("helping"))}
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
              roles={store$.get().meta.roles}
              link={link}
              saveState={store$.get().meta.saveState}
              lastSaved={store$.get().meta.lastSaved}
              showQuickmenu={true}
              parentPath="/helfen"
            >
              <Erklaerbaer
                save$={store$.pipe(obj.sub("save"))}
                roles={store$.get().meta.roles}
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
              roles={store$.get().meta.roles}
              link={link}
              saveState={store$.get().meta.saveState}
              lastSaved={store$.get().meta.lastSaved}
              showQuickmenu={true}
            >
              <Zusammenfassung
                save$={store$.pipe(obj.sub("save"))}
                publicResource={publicResource}
                link={link}
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
                roles={store$.get().meta.roles}
                link={link}
                saveState={store$.get().meta.saveState}
                lastSaved={store$.get().meta.lastSaved}
                showQuickmenu={true}
              >
                <Box type="danger">{TXT.error.siteNotFound}</Box>
              </Layout>
            );
          },
        },
      ]}
    </HashRouter>
  );
}
