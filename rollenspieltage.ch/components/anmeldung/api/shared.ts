import { z } from "astro/zod";

export const daySchema = z.enum(["SATURDAY", "SUNDAY"]);

export const timeSlotSchema = z
  .object({
    uuid: z.string().uuid(),
    day: daySchema,
    from: z.number(),
    to: z.number(),
  })
  .refine((slot) => slot.from < slot.to, {
    message: "A TimeSlot can't end before it starts.",
  });
export type TimeSlot = z.infer<typeof timeSlotSchema>;

export const tagSchema = z.object({
  name: z.string(),
  label: z.string(),
  description: z.string(),
});
export type Tag = z.infer<typeof tagSchema>;

export const publishStateSchema = z.enum(["draft", "published", "archived"]);
export type PublishState = z.infer<typeof publishStateSchema>;
