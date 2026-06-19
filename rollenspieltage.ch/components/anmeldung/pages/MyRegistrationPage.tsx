import { Box } from "@common/components/Box";
import {
  ErrorBoundary,
  Match,
  Switch,
  createResource,
  type JSX,
} from "solid-js";
import "@rst/components/anmeldung/anmeldung.scss";
import { loadSave } from "@rst/components/anmeldung/api/save";
import { TXT } from "@common/utils/texts";
import { unpackUnion } from "@common/components/utils";
import { Router } from "@rst/components/anmeldung/components/Router";
import { unsafeToRegistrationUuid } from "@common/utils/ids";

function Loading(): JSX.Element {
  return <Box>{TXT.loading.registration}</Box>;
}

export function MeineAnmeldungWrapper(): JSX.Element {
  const url = URL.parse(location.toString().replace("#/", "")); // bit hacky to work with Solid Router
  const secret = unsafeToRegistrationUuid(
    url?.searchParams.get("secret") ?? "no-secret-found",
  );
  const [saveResource] = createResource(() => loadSave(secret));

  return (
    <ErrorBoundary
      fallback={(err) => {
        console.error(err);
        return <Box type="danger">{TXT.error.general}</Box>;
      }}
    >
      <Switch fallback={<Loading />}>
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
    </ErrorBoundary>
  );
}
