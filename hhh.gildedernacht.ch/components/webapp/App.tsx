import API, { loadServerResource } from "@hhh/components/webapp/api/api";
import { NetworkError } from "@hhh/components/webapp/components/static/NetworkError";
import { Progress } from "@hhh/components/webapp/components/static/Progress";
import { Layout } from "@hhh/components/webapp/layout/Layout";
import { Router } from "@hhh/components/webapp/pages/util/Router";
import type { AppState } from "@hhh/components/webapp/util/StateTypes";
import { setToast } from "@hhh/components/webapp/util/utils";
import { DateTime } from "luxon";
import {
  createResource,
  createSignal,
  type JSX,
  Match,
  Switch,
} from "solid-js";
import { Dynamic } from "solid-js/web";

export const App = (): JSX.Element => {
  const [now, _] = createSignal(DateTime.now());
  const [data, { refetch }] = createResource(now, loadServerResource);
  const [state, setState] = createSignal<AppState>({
    page: "start",
    activeOrder: null,
    toast: {},
    showRestaurantList: false,
    showOrderList: false,
    showEntryList: false,
  });

  return (
    <Layout stateSignal={[state, setState]}>
      <div class="container p-5">
        <Switch fallback={<Progress />}>
          <Match when={typeof data.error !== "undefined"}>
            <NetworkError />
          </Match>
          <Match when={data()}>
            {(data) => (
              <Dynamic
                component={Router[state().page]({
                  data: data(),
                  stateSignal: [state, setState],
                  API: API({ refetch, setToast: setToast(setState) }),
                })}
              />
            )}
          </Match>
        </Switch>
      </div>
    </Layout>
  );
};
