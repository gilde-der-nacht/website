import { z } from "astro/zod";

export const daySchema = z.enum(["SATURDAY", "SUNDAY"]);

export const timeSlotSchema = z
  .object({
    day: daySchema,
    from: z.number(),
    to: z.number(),
  })
  .refine((slot) => slot.from < slot.to, {
    message: "A TimeSlot can't end before it starts.",
  });

export const tagSchema = z.object({
  name: z.string(),
  label: z.string(),
  description: z.string(),
});
export type Tag = z.infer<typeof tagSchema>;
