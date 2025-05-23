import { z } from "astro/zod";
import { timeSlotSchema } from "@rst/components/anmeldung/api/shared";
import {
  numberInputSchema,
  textInputSchema,
} from "@rst/components/anmeldung/api/form";
import { sortTwoNumbers } from "@common/components/utils";

/*
 * Types
 */

export const gameroundEditServerSchema = z.object({
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
  playerNames: z.array(z.string()),
  tagNames: z.array(z.string()),
});
export type GameroundEditServer = z.infer<typeof gameroundEditServerSchema>;

export const gameroundEditClientSchema = z.object({
  uuid: z.string().uuid(),
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
  playerNames: z.array(textInputSchema),
  tagNames: z.array(z.string()),
});
export type GameroundEditClient = z.infer<typeof gameroundEditClientSchema>;
