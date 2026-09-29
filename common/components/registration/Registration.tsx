import { onMount, type JSX } from "solid-js";
import { RegistrationState } from "@registration/State";
import { getRegistrationUuid } from "@registration/registrationUuid";
import { Header } from "@registration/Header";
import { Main } from "@registration/Main";
import { Footer } from "@registration/Footer";

const state = new RegistrationState();

export function Registration(): JSX.Element {
  onMount(() => {
    const registrationUuid = getRegistrationUuid();
    state.connect(registrationUuid);
  });
  return (
    <section class="Registration">
      <Header />
      <Main />
      <Footer
        connectionStatus={state.state$.get().connectionState.connectionStatus}
      />
    </section>
  );
}
