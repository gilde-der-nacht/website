import { onMount, type JSX } from "solid-js";
import { RegistrationState } from "@registration/State";
import { getRegistrationUuid } from "@registration/registrationUuid";
import { Header } from "@registration/Header";
import { Main } from "@registration/Main";
import { Footer } from "@registration/Footer";
import type { ConfigUuid } from "@common/utils/ids";
import { ShowReactive } from "@common/components/ShowReactive";
import { TextInputField } from "@registration/components/Form";

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
                <TextInputField
                  field$={formState$.sub("myAccount").sub("name")}
                />
              </div>
              <hr />
              <div>
                <TextInputField
                  field$={formState$.sub("myAccount").sub("email")}
                />
              </div>
              <hr />
              <code>
                <pre>{JSON.stringify(formState$.get(), null, 2)}</pre>
              </code>
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
