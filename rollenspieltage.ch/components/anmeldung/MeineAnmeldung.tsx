import { Match, Switch, onMount } from "solid-js";
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
      state: "SECRET_MISSING";
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
      setStore({ state: "SECRET_MISSING" } satisfies Store);
    }
  });

  return (
    <>
      <Switch>
        <Match when={store.state === "IDLE"}>
          <h1>IDLE</h1>
        </Match>
        <Match when={store.state === "LOADING"}>
          <h1>LOADING</h1>
        </Match>
      </Switch>
    </>
  );
}
