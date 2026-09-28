import type { RegistrationUuid } from "@common/utils/ids";
import { Connection } from "@registration/Connection";

export class RegistrationState {
  connection: Connection | null = null;

  connect(registrationUuid: RegistrationUuid): void {
    this.connection = new Connection(registrationUuid);
  }
}
