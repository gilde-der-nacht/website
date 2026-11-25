import { onSettled } from "solid-js";
import type { JSX } from "@solidjs/web";
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
  onSettled(() => {
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
                  value$={formState$.sub("myAccount").sub("name").sub("raw")}
                />
                <code>
                  {JSON.stringify(formState$.get().myAccount.name.raw)}
                </code>
              </div>
              <div>
                <TextInputField
                  value$={formState$.sub("myAccount").sub("email").sub("raw")}
                />
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
