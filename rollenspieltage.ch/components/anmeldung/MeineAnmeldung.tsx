import { Box } from "@common/components/Box";
import { onMount } from "solid-js";
import type { JSX } from "solid-js/jsx-runtime";
import { createStore } from "solid-js/store";

type Store =
  | {
      state: "IDLE";
      secret: string;
      showCreateMessage: boolean;
    }
  | {
      state: "LOADING";
    }
  | {
      state: "ERROR";
      message: JSX.Element;
    };

export function MeineAnmeldung(): JSX.Element {
  const [store, setStore] = createStore<Store>({
    state: "LOADING",
  });

  onMount(async () => {
    const currentUrl = new URL(location.href);
    const secret = currentUrl.searchParams.get("secret");
    const showCreateMessage =
      currentUrl.searchParams.get("showCreateMessage") === "true";

    currentUrl.searchParams.delete("showCreateMessage");
    history.replaceState({}, document.title, currentUrl);

    if (secret !== null) {
      setStore({ state: "IDLE", secret, showCreateMessage } satisfies Store);
    } else {
      setStore({
        state: "ERROR",
        message: (
          <p>
            Wir konnten leider keine Anmeldung finden. Wenn du bereits eine
            Anmeldung begonnen hast, solltest du den korrekten Link per E-Mail
            erhalten haben. Falls du noch keine Anmeldung begonnen hast, kannst
            du <a href="/anmeldung">hier</a> deine persönliche Anmeldung
            beginnen. Für generelle Fragen oder Probleme, schreibe uns doch
            bitte über unser <a href="/kontatk">Kontaktformular</a>.
          </p>
        ),
      } satisfies Store);
    }
  });

  return (
    <>
      {store.state === "IDLE" ? (
        <h1>IDLE</h1>
      ) : store.state === "LOADING" ? (
        <Box>
          <p>Deine Anmeldung wird geladen.</p>
        </Box>
      ) : (
        <Box type="danger">{store.message}</Box>
      )}
    </>
  );
}
