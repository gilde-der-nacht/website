import API, { loadServerResource } from "@hhh/components/webapp/api/api";
import { NetworkError } from "@hhh/components/webapp/components/static/NetworkError";
import { Progress } from "@hhh/components/webapp/components/static/Progress";
import { Layout } from "@hhh/components/webapp/layout/Layout";
import { Router } from "@hhh/components/webapp/pages/util/Router";
import type { AppState } from "@hhh/components/webapp/util/StateTypes";
import { setToast } from "@hhh/components/webapp/util/utils";
import { DateTime } from "luxon";
import { createMemo, createSignal, Errored, Loading, refresh } from "solid-js";
import type { JSX } from "@solidjs/web";

export const App = (): JSX.Element => {
  const [now, _] = createSignal(DateTime.now());
  const data = createMemo(() => loadServerResource(now()));

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
      <div>
        <div class="container p-5">
          <Errored fallback={<NetworkError />}>
            <Loading fallback={<Progress />}>
              {Router[state().page]({
                data: data(),
                stateSignal: [state, setState],
                API: API({
                  refetch: () => refresh(data),
                  setToast: setToast(setState),
                }),
              })()}
            </Loading>
          </Errored>
        </div>
      </div>
    </Layout>
  );
};
