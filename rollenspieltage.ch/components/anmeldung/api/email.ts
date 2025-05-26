export function queueuPublishGameround(gameUuid: string): () => Promise<void> {
  const now = new Date();
  return async () =>
    new Promise((res) => {
      setTimeout(() => {
        console.error("NOT YET IMPLEMENTED: `publishGameround`", gameUuid, now);
        return res();
      }, 500);
    });
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
