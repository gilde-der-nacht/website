import { onMount, type JSX } from "solid-js";
import { RegistrationState } from "@registration/State";
import { getRegistrationUuid } from "@registration/registrationUuid";

const state = new RegistrationState();

export function Registration(): JSX.Element {
  onMount(() => {
    const registrationUuid = getRegistrationUuid();
    state.connect(registrationUuid);
  });
  return <h2>Registration</h2>;
}
