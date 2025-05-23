import { Box } from "@common/components/Box";
import {
  ErrorBoundary,
  Match,
  Show,
  Suspense,
  Switch,
  createResource,
  createSignal,
  onMount,
  type JSX,
} from "solid-js";
import "@rst/components/anmeldung/anmeldung.scss";
import { Router } from "@rst/components/anmeldung/Router";
import { loadSave } from "@rst/components/anmeldung/api/save";
import {
  getMetaState,
  type MetaClient,
} from "@rst/components/anmeldung/api/meta";
import { loadProgram } from "@rst/components/anmeldung/api/program";
import { TXT } from "@rst/components/anmeldung/constant/texts";
import { unpackUnion } from "@common/components/utils";

function Loading(): JSX.Element {
  return <Box>{TXT.loading}</Box>;
}

export function MeineAnmeldungWrapper(): JSX.Element {
  const [pageState, setPageState] = createSignal<MetaClient | null>(null);

  onMount(() => {
    const currentUrl = new URL(location.href);
    setPageState(getMetaState(currentUrl));
  });

  return (
    <Show fallback={<Loading />} when={pageState()}>
      {(pageAccessor) => <MeineAnmeldung page={pageAccessor()} />}
    </Show>
  );
}

function MeineAnmeldung(props: { page: MetaClient }): JSX.Element {
  const [saveResource] = createResource(() => loadSave(props.page.secret));
  const [programResource] = createResource(() =>
    loadProgram(props.page.secret),
  );

  return (
    <ErrorBoundary
      fallback={(err) => (
        <Box type="danger">
          <Switch fallback={TXT.error.general}>
            <Match when={err.message === "SECRET_ERROR"}>
              {TXT.error.secretError}
            </Match>
          </Switch>
        </Box>
      )}
    >
      <Suspense fallback={<Loading />}>
        <Switch>
          <Match when={saveResource()}>
            {(state) => {
              const { kind, value } = unpackUnion(state());
              if (kind === "FAILURE") {
                return <Box type="danger">{TXT.error.ourMistake}</Box>;
              }
              return (
                <Router
                  meta={props.page}
                  save={value.data}
                  programResource={programResource}
                />
              );
            }}
          </Match>
        </Switch>
      </Suspense>
    </ErrorBoundary>
  );
}
