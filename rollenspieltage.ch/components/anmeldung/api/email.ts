import { elysiumPublishGameround } from "@rst/components/anmeldung/api/elysium";

export function queueuPublishGameround(
  secret: string,
  gameroundUuid: string,
): () => Promise<void> {
  return async () => {
    await elysiumPublishGameround({ secret, gameroundUuid });
  };
}

export function queueSendGameroundUpdate(
  update: string,
  slotUuids: string[],
): () => Promise<void> {
  const now = new Date();
  return async () =>
    new Promise((res) => {
      setTimeout(() => {
        console.error(
          "NOT YET IMPLEMENTED: `sendGameroundUpdate`",
          update,
          slotUuids.join(", "),
          now,
        );
        return res();
      }, 500);
    });
}

export type EmailQueueableFns = () => Promise<void>;
