import {
  createResource,
  createSignal,
  Match,
  onMount,
  Show,
  Switch,
  type JSX,
} from "solid-js";
import { Box } from "@common/components/Box";

export function HydrationHelper<T>(props: {
  strategy:
    | {
        kind: "SSR_ONLY";
      }
    | {
        kind: "CLIENT_REFRESH";
        showOutdatedData: boolean;
        showLoading: boolean;
      };
  fetcher: () => Promise<T>;
  children: (data: T, FeedbackBox: () => JSX.Element | null) => JSX.Element;
}): JSX.Element {
  const [outdatedData, setOutdatedData] = createSignal(false);
  const [clientLoadingDone, setClientLoadingDone] = createSignal(false);
  const [data, { mutate }] = createResource(() => props.fetcher());

  onMount(async () => {
    if (props.strategy.kind === "SSR_ONLY") {
      return;
    }

    try {
      const data = await props.fetcher();
      mutate(() => data);
    } catch (e) {
      console.error(e);
      if (props.strategy.showOutdatedData) {
        setOutdatedData(true);
      }
    } finally {
      setClientLoadingDone(true);
    }
  });

  function showLoadingBlock(): boolean {
    if (props.strategy.kind === "SSR_ONLY") {
      return false;
    }

    if (!props.strategy.showLoading) {
      return false;
    }

    if (clientLoadingDone()) {
      return false;
    }

    return true;
  }

  function FeedbackBox(): JSX.Element {
    return (
      <Switch>
        <Match when={outdatedData()}>
          <Box type="danger" icon="triangle-exclamation">
            Inhalte konnten nicht aktualisiert werden und sind eventuell
            veraltet!
          </Box>
        </Match>
        <Match when={showLoadingBlock()}>
          <Box type="gray" icon="spinner" iconRotating>
            Inhalte werden aktualisiert ...
          </Box>
        </Match>
      </Switch>
    );
  }

  return (
    <Show when={data()}>{(data) => props.children(data(), FeedbackBox)}</Show>
  );
}
