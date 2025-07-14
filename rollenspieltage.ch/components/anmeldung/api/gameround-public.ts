import { sortTwoNumbers } from "@common/components/utils";
import { timeSlotSchema } from "@rst/components/anmeldung/api/shared";
import { z } from "astro/zod";

/*
 * Types
 */

export const gameroundPublicServerSchema = z.object({
  uuid: z.string().uuid(),
  gamemaster: z.string(),
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
      reserved: z.number(),
    })
    .transform((count) => {
      const [min, max] = sortTwoNumbers([count.min, count.max]);
      const reserved = Math.min(max, count.reserved);
      return { min, max, reserved };
    }),
  tagNames: z.array(z.string()),
});
export type GameroundPublicServer = z.infer<typeof gameroundPublicServerSchema>;
