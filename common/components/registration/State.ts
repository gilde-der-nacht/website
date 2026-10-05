import type { ConfigUuid, RegistrationUuid } from "@common/utils/ids";
import { createReactive } from "@common/utils/reactivity";
import {
  Connection,
  getInitialConnectionState,
  type ConnectionState,
} from "@registration/Connection";
import { getInitialContact, type Contact } from "@registration/Contact";

export type State = {
  connectionState: ConnectionState;
  contact: Contact;
};

function getInitialState(): State {
  return {
    connectionState: getInitialConnectionState(),
    contact: getInitialContact(),
  };
}

export class RegistrationState {
  connection: Connection | null = null;
  state$ = createReactive<State>(getInitialState());

  connect(configUuid: ConfigUuid, registrationUuid: RegistrationUuid): void {
    this.connection = new Connection(
      configUuid,
      registrationUuid,
      this.state$.sub("connectionState"),
    );
  }
}
