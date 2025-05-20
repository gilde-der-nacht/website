import { z } from "astro/zod";
import { timeSlotSchema } from "@rst/components/anmeldung/state/general";
import { sortTwoNumbers } from "@common/components/utils";

/*
 * Playing
 */

const playingServerSchema = z.object({
  wantsUpdates: z.boolean(),
});

/*
 * Master
 */

const gameroundSchema = z.object({
  uuid: z.string().uuid(),
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

const masterServerSchema = z.object({
  games: z.array(gameroundSchema),
  wantsHelp: z.boolean(),
});

/*
 * Helping
 */

const helpingServerSchema = z.object({});

/*
 * Everything
 */

export const saveServerSchema = z.object({
  uuid: z.string().uuid(),
  name: z.string(),
  email: z.string(),
  mobile: z.string(),
  lastSaved: z.string(),
  playing: playingServerSchema,
  master: masterServerSchema,
  helping: helpingServerSchema,
});

export type SaveServer = z.infer<typeof saveServerSchema>;
