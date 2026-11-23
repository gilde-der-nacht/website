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
          reactive$={state.state$.sub("formState")}
          fallback={() => <code>Loading...</code>}
        >
          {(formState$) => (
            <>
              <div>
                <strong>Name: </strong>
                <code>
                  {JSON.stringify(formState$.get().myAccount.name.raw)}
                </code>
              </div>
              <div>
                <strong>Email: </strong>
                <code>
                  {JSON.stringify(formState$.get().myAccount.email.raw)}
                </code>
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
