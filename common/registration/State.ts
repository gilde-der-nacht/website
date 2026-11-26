import type { ConfigUuid, RegistrationUuid } from "@common/utils/ids";
import { createReactive } from "@common/utils/reactivity";
import {
  Connection,
  getInitialConnectionState,
  type ConnectionState,
} from "@registration/Connection";
import { getInitialContact, type Contact } from "@registration/Contact";
import type { z } from "astro/zod";
import type { AccountForm } from "@registration/state/account";
import type { SaveForm } from "@registration/state/save";
import type { Form } from "@registration/state/form";

export type FormState = {
  form: {
    myAccount: Form<z.infer<typeof AccountForm.wireSchema>>;
    save: Form<z.infer<typeof SaveForm.wireSchema>>;
  };
  currentRevision: number;
};

export type AppState = {
  connectionState: ConnectionState;
  contact: Contact;
  formState: null | FormState;
};

function getInitialAppState(): AppState {
  return {
    connectionState: getInitialConnectionState(),
    contact: getInitialContact(),
    formState: null,
  };
}

export class RegistrationState {
  connection: Connection | null = null;
  state$ = createReactive<AppState>(getInitialAppState());

  connect(configUuid: ConfigUuid, registrationUuid: RegistrationUuid): void {
    this.connection = new Connection(
      configUuid,
      registrationUuid,
      this.state$.sub("connectionState"),
      this.state$.sub("formState"),
    );
  }
}
