import {
  elysiumPublishGameround,
  elysiumSendGameroundUpdate,
} from "@rst/components/anmeldung/api/elysium";

export function queueuPublishGameround(payload: {
  secret: string;
  gameroundUuid: string;
}): () => Promise<void> {
  return async () => {
    await elysiumPublishGameround(payload);
  };
}

export function queueSendGameroundUpdate(payload: {
  update: string;
  slotUuids: string[];
  gameroundUuid: string;
}): () => Promise<void> {
  return async () => {
    await elysiumSendGameroundUpdate(payload);
  };
}

export type EmailQueueableFns = () => Promise<void>;
