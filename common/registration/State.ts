import type { ConfigUuid, RegistrationUuid } from "@common/utils/ids";
import { createReactive } from "@common/utils/reactivity";
import {
  Connection,
  getInitialConnectionState,
  type ConnectionState,
} from "@registration/Connection";
import { getInitialContact, type Contact } from "@registration/Contact";
import type { Editable } from "@registration/state/Editable";
import type { Backend } from "@registration/state/BackendState";

export type State = {
  connectionState: ConnectionState;
  contact: Contact;
  state: null | {
    backendState: Backend;
    editableState: Editable;
  };
};

function getInitialState(): State {
  return {
    connectionState: getInitialConnectionState(),
    contact: getInitialContact(),
    state: null,
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
      this.state$.sub("state"),
    );
  }
}
