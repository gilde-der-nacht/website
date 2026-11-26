import type { ConfigUuid, RegistrationUuid } from "@common/utils/ids";
import { elysium } from "@common/components/utils";
import { type Reactive } from "@common/utils/reactivity";
import { messagesInSchema } from "@registration/messages/in";
import type { FormState } from "@registration/State";
import { trySync, updateInitialState } from "@registration/state/actions";
import { createEffect, createMemo } from "solid-js";
import { toSync, type Sync } from "@registration/state/sync";
import { messagesOutSchema, type MessageOut } from "./messages/out";

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
  send: (out: MessageOut) => void = () => {
    throw new Error("Connection.send: Connection missing");
  };

  constructor(
    configUuid: ConfigUuid,
    registrationUuid: RegistrationUuid,
    connectionState$: Reactive<ConnectionState>,
    formState$: Reactive<null | FormState>,
  ) {
    this.ws = this.setup(
      configUuid,
      registrationUuid,
      connectionState$.sub("connectionStatus"),
      formState$,
    );
  }

  setup(
    configUuid: ConfigUuid,
    registrationUuid: RegistrationUuid,
    connectionStatus$: Reactive<ConnectionStatus>,
    formState$: Reactive<null | FormState>,
    retry: boolean = false,
  ): WebSocket {
    const socket = new WebSocket(endpoint);

    connectionStatus$.set(retry ? "RECONNECTING" : "CONNECTING");

    socket.addEventListener("message", (message) => {
      const parsed = messagesInSchema.safeParse(JSON.parse(message.data));
      if (parsed.success) {
        if (formState$.get() === null) {
          updateInitialState(formState$, parsed.data);

          const syncData = createMemo((): null | Sync<FormState["form"]> => {
            const state = formState$.get();
            if (state === null) {
              return state;
            }
            return toSync(state.form);
          });
          createEffect(() => {
            const data = syncData();
            if (data !== null) {
              trySync(
                {
                  currentRevision: formState$.get()?.currentRevision ?? -1,
                  form: data,
                },
                this,
              );
            }
          });
        }
      } else {
        console.log(parsed.error);
      }
    });

    socket.addEventListener("open", () => {
      connectionStatus$.set("CONNECTED");
      this.send = (out) => {
        console.log(out);
        console.log(messagesOutSchema.parse(out));
        return socket.send(JSON.stringify(messagesOutSchema.parse(out)));
      };

      const payload: MessageOut = {
        kind: "REGISTER",
        configUuid,
        registrationUuid,
      };
      this.send(payload);

      const payload2: MessageOut = {
        kind: "REQUEST_VIEW",
      };
      this.send(payload2);
    });

    socket.addEventListener("close", () => {
      connectionStatus$.set("DISCONNECTED");
      setTimeout(() => {
        this.ws = this.setup(
          configUuid,
          registrationUuid,
          connectionStatus$,
          formState$,
          true,
        );
      }, Math.random() * 5000);
    });

    return socket;
  }
}
