import { onMount, type JSX } from "solid-js";
import { RegistrationState } from "@registration/State";
import { getRegistrationUuid } from "@registration/registrationUuid";
import { Header } from "@registration/Header";
import { Main } from "@registration/Main";
import { Footer } from "@registration/Footer";
import type { ConfigUuid } from "@common/utils/ids";
import { ShowReactive } from "@common/components/ShowReactive";

const state = new RegistrationState();

export function Registration(props: { configUuid: ConfigUuid }): JSX.Element {
  onMount(() => {
    const registrationUuid = getRegistrationUuid();
    state.connect(props.configUuid, registrationUuid);
  });

  return (
    <section class="Registration">
      <Header />
      <div>
        <hr />
        <ShowReactive
          reactive$={state.state$.sub("state")}
          fallback={() => <code>Loading...</code>}
        >
          {(state$) => (
            <>
              <div>
                <strong>Backend: </strong>
                <code>{JSON.stringify(state$.get().backendState)}</code>
              </div>
              <div>
                <strong>Editable: </strong>
                <code>{JSON.stringify(state$.get().editableState)}</code>
              </div>
            </>
          )}
        </ShowReactive>
        <hr />
        <Main />
      </div>
      <Footer
        connectionStatus={state.state$.get().connectionState.connectionStatus}
      />
    </section>
  );
}
