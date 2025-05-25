import { z } from "astro/zod";
import {
  publishStateSchema,
  timeSlotSchema,
} from "@rst/components/anmeldung/api/shared";
import {
  numberInputSchema,
  textInputSchema,
} from "@rst/components/anmeldung/api/form";
import { sortTwoNumbers } from "@common/components/utils";
import type { ParseResult } from "@rst/components/anmeldung/api/utils";

/*
 * Types
 */

export const gameroundEditServerSchema = z.object({
  uuid: z.string().uuid(),
  kind: publishStateSchema,
  title: z.string(),
  system: z.string(),
  description: z.object({
    short: z.string(),
    long: z.string(),
  }),
  slots: z.array(timeSlotSchema),
  playerCount: z
    .object({
      min: z.number().min(1),
      max: z.number(),
    })
    .transform((count) => {
      const [min, max] = sortTwoNumbers([count.min, count.max]);
      return { min, max };
    }),
  tagNames: z.array(z.string()),
});
export type GameroundEditServer = z.infer<typeof gameroundEditServerSchema>;

export const gameroundEditClientSchema = z.object({
  uuid: z.string().uuid(),
  kind: publishStateSchema,
  title: textInputSchema,
  system: textInputSchema,
  description: z.object({
    short: textInputSchema,
    long: textInputSchema,
  }),
  slots: z.array(timeSlotSchema),
  playerCount: z.object({
    min: numberInputSchema,
    max: numberInputSchema,
  }),
  tagNames: z.array(z.string()),
});
export type GameroundEditClient = z.infer<typeof gameroundEditClientSchema>;

export function getNewGameround(): GameroundEditClient {
  const server = {
    uuid: crypto.randomUUID(),
    kind: "DRAFT",
    title: "",
    system: "",
    description: {
      short: "",
      long: "",
    },
    slots: [],
    playerCount: {
      min: 2,
      max: 4,
    },
    tagNames: ["deutsch"],
  } satisfies GameroundEditServer;
  const parseResult = transformGameroundFromServer(server);
  if (parseResult.success) {
    return parseResult.data;
  }
  console.error(parseResult);
  throw Error("should not happen");
}

function transformGameroundFromServer(
  s: GameroundEditServer,
): ParseResult<GameroundEditClient> {
  return gameroundEditClientSchema.safeParse(s);
}
