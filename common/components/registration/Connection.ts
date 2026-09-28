import type { RegistrationUuid } from "@common/utils/ids";
import { elysium } from "@common/components/utils";
import { z } from "astro/zod";

const endpoint = elysium("/registration/ws");

export class Connection {
  ws: WebSocket;

  constructor(registrationUuid: RegistrationUuid) {
    this.ws = new WebSocket(endpoint);
    this.ws.addEventListener("open", () => {
      const payload: Payload = {
        kind: "START",
        registrationUuid: registrationUuid,
      };
      this.ws.send(JSON.stringify(payload));
      const payload2: Payload = {
        kind: "BROADCAST",
        message: "I am sending you this",
      };
      this.ws.send(JSON.stringify(payload2));
    });
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
