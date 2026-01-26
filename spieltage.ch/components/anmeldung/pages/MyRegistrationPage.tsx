import { Box } from "@common/components/Box";
import {
  ErrorBoundary,
  Match,
  Suspense,
  Switch,
  createResource,
  type JSX,
} from "solid-js";
import "@lst/components/anmeldung/anmeldung.scss";
import { loadSave } from "@lst/components/anmeldung/api/save";
import { TXT } from "@common/utils/texts";
import { unpackUnion } from "@common/components/utils";
import { Router } from "@lst/components/anmeldung/components/Router";

function Loading(): JSX.Element {
  return <Box>{TXT.loading.registration}</Box>;
}

export function MeineAnmeldungWrapper(): JSX.Element {
  const url = URL.parse(location.toString().replace("#/", "")); // bit hacky to work with Solid Router
  const secret = url?.searchParams.get("secret") ?? "no-secret-found";
  const [saveResource] = createResource(() => loadSave(secret));

  return (
    <ErrorBoundary
      fallback={(err) => {
        console.error(err);
        return <Box type="danger">{TXT.error.general}</Box>;
      }}
    >
      <Suspense fallback={<Loading />}>
        <Switch>
          <Match when={saveResource()}>
            {(state) => {
              const { kind, value } = unpackUnion(state());
              if (kind === "FAILURE") {
                if (value.reason === "SECRET_INVALID") {
                  return <Box type="danger">{TXT.error.secretError}</Box>;
                }
                console.error(value);
                return <Box type="danger">{TXT.error.ourMistake}</Box>;
              }
              return <Router initState={value.data} secret={secret} />;
            }}
          </Match>
        </Switch>
      </Suspense>
    </ErrorBoundary>
  );
}
