import type { RegistrationUuid } from "@common/utils/ids";
import { elysium } from "@common/components/utils";
import { z } from "astro/zod";
import { obj, type Reactive } from "@common/utils/reactivity";

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
    registrationUuid: RegistrationUuid,
    connectionState$: Reactive<ConnectionState>,
  ) {
    this.ws = this.setup(
      registrationUuid,
      connectionState$.pipe(obj.sub("connectionStatus")),
    );
  }

  setup(
    registrationUuid: RegistrationUuid,
    connectionStatus$: Reactive<ConnectionStatus>,
    retry: boolean = false,
  ): WebSocket {
    const socket = new WebSocket(endpoint);
    connectionStatus$.set(retry ? "RECONNECTING" : "CONNECTING");

    socket.addEventListener("open", () => {
      connectionStatus$.set("CONNECTED");
      const payload: Payload = {
        kind: "START",
        registrationUuid: registrationUuid,
      };
      socket.send(JSON.stringify(payload));
      const payload2: Payload = {
        kind: "BROADCAST",
        message: "I am sending you this",
      };
      socket.send(JSON.stringify(payload2));
    });

    socket.addEventListener("close", () => {
      console.log("closed");
      connectionStatus$.set("DISCONNECTED");
      setTimeout(() => {
        this.ws = this.setup(registrationUuid, connectionStatus$, true);
      }, Math.random() * 5000);
    });

    return socket;
  }
}

const payloadSchema = z.union([
  z.object({
    kind: z.literal("START"),
    registrationUuid: z.string,
  }),
  z.object({
    kind: z.literal("BROADCAST"),
    message: z.string,
  }),
]);

type Payload = z.infer<typeof payloadSchema>;
