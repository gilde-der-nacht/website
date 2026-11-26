import { z } from "astro/zod";
import { Temporal } from "@js-temporal/polyfill";

export const daySchema = z.enum(["SATURDAY", "SUNDAY"]);

export const timeSlotSchema = z
  .object({
    uuid: z.uuid(),
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

export const UNAUTHORIZED = "UNAUTHORIZED" as const;
export const unauthorizedSchema = z.literal(UNAUTHORIZED);

export const plainDateSchema = z.string().regex(/\d{4}-\d{2}-\d{2}/);

export type PlainDate = z.infer<typeof plainDateSchema>;

export function plainDateToString(date: Temporal.PlainDate): PlainDate {
  const year = date.year
    .toString()
    .padStart(4, "0") as `${number}${number}${number}${number}`;
  const month = date.month.toString().padStart(2, "0") as `${number}${number}`;
  const day = date.day.toString().padStart(2, "0") as `${number}${number}`;

  return `${year}-${month}-${day}`;
}

export const plainTimeSchema = z.string().regex(/\d{2}:\d{2}:\d{2}/);

export type PlainTime = z.infer<typeof plainTimeSchema>;

export function plainTimeToString(date: Temporal.PlainTime): PlainTime {
  const hour = date.hour.toString().padStart(2, "0") as `${number}${number}`;
  const minute = date.minute
    .toString()
    .padStart(2, "0") as `${number}${number}`;
  const second = date.second
    .toString()
    .padStart(2, "0") as `${number}${number}`;

  return `${hour}:${minute}:${second}`;
}

export const timestampSchema = z.object({
  day: plainDateSchema,
  time: plainTimeSchema,
});

export type Timestamp = z.infer<typeof timestampSchema>;

export function toPlainDateTime(ts: Timestamp): Temporal.PlainDateTime {
  return Temporal.PlainDateTime.from(`${ts.day} ${ts.time}`);
}

export function getCurrentTimestamp(): Timestamp {
  const day = Temporal.Now.plainDateISO();
  const time = Temporal.Now.plainTimeISO();

  return {
    day: plainDateToString(day),
    time: plainTimeToString(time),
  };
}

export const durationSchema = z.object({
  start: timestampSchema,
  duration: z.object({ hours: z.number() }),
});

export type Duration = z.infer<typeof durationSchema>;

export const durationEditSchema = z.object({
  start: z.object({
    day: z.string(),
    time: z.string(),
  }),
  end: z.object({
    time: z.string(),
  }),
});

export type DurationEdit = z.infer<typeof durationEditSchema>;
