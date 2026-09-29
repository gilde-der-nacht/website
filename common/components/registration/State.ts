import type { RegistrationUuid } from "@common/utils/ids";
import { createReactive, obj } from "@common/utils/reactivity";
import {
  Connection,
  getInitialConnectionState,
  type ConnectionState,
} from "@registration/Connection";

export type State = {
  connectionState: ConnectionState;
};

function getInitialState(): State {
  return {
    connectionState: getInitialConnectionState(),
  };
}

export class RegistrationState {
  connection: Connection | null = null;
  state$ = createReactive<State>(getInitialState());

  connect(registrationUuid: RegistrationUuid): void {
    this.connection = new Connection(
      registrationUuid,
      this.state$.pipe(obj.sub("connectionState")),
    );
  }
}
