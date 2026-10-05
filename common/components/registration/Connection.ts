import type { ConfigUuid, RegistrationUuid } from "@common/utils/ids";
import { elysium } from "@common/components/utils";
import { z } from "astro/zod";
import { type Reactive } from "@common/utils/reactivity";

const connectionStatusses = [
  "INITIAL",
  "CONNECTING",
  "CONNECTED",
  "DISCONNECTED",
  "RECONNECTING",
] as const;

export type ConnectionStatus = (typeof connectionStatusses)[number];

export type ConnectionState = {
  connectionStatus: ConnectionStatus;
};
export function getInitialConnectionState(): ConnectionState {
  return {
    connectionStatus: "INITIAL",
  };
}

const endpoint = elysium("/registration/ws");

export class Connection {
  ws: WebSocket;

  constructor(
    configUuid: ConfigUuid,
    registrationUuid: RegistrationUuid,
    connectionState$: Reactive<ConnectionState>,
  ) {
    this.ws = this.setup(
      configUuid,
      registrationUuid,
      connectionState$.sub("connectionStatus"),
    );
  }

  setup(
    configUuid: ConfigUuid,
    registrationUuid: RegistrationUuid,
    connectionStatus$: Reactive<ConnectionStatus>,
    retry: boolean = false,
  ): WebSocket {
    const socket = new WebSocket(endpoint);
    connectionStatus$.set(retry ? "RECONNECTING" : "CONNECTING");

    socket.addEventListener("open", () => {
      connectionStatus$.set("CONNECTED");
      const payload: Payload = {
        kind: "REGISTER",
        configUuid,
        registrationUuid,
      };
      socket.send(JSON.stringify(payload));
      const payload2: Payload = {
        kind: "REQUEST_VIEW",
      };
      socket.send(JSON.stringify(payload2));
    });

    socket.addEventListener("close", () => {
      console.log("closed");
      connectionStatus$.set("DISCONNECTED");
      setTimeout(() => {
        this.ws = this.setup(
          configUuid,
          registrationUuid,
          connectionStatus$,
          true,
        );
      }, Math.random() * 5000);
    });

    return socket;
  }
}

const payloadSchema = z.union([
  z.object({
    kind: z.literal("REGISTER"),
    configUuid: z.uuid,
    registrationUuid: z.uuid,
  }),
  z.object({
    kind: z.literal("REQUEST_VIEW"),
  }),
]);

type Payload = z.infer<typeof payloadSchema>;
