import { z } from "astro/zod";
import { elysium } from "./utils";

const locationSchema = z.object({
  label: z.string(),
  labelLong: z.nullable(z.string()),
  virtual: z.boolean(),
  url: z.nullable(z.string().url()),
  comment: z.nullable(z.string()),
});

const organizerSchema = z.object({
  name: z.string(),
  url: z.nullable(z.string()),
});

const simpleDateSchema = z.object({
  day: z.number(),
  month: z.number(),
  year: z.number(),
});

export type SimpleDate = z.infer<typeof simpleDateSchema>;

const simpleTimeSchema = z.object({
  hour: z.number(),
  minute: z.number(),
});

export type SimpleTime = z.infer<typeof simpleTimeSchema>;

const simpleDateTimeSchema = z.object({
  startDate: simpleDateSchema,
  endDate: z.nullable(simpleDateSchema),
  startTime: z.nullable(simpleTimeSchema),
  endTime: z.nullable(simpleTimeSchema),
});

export type SimpleDateTime = z.infer<typeof simpleDateTimeSchema>;

const eventSchema = z.object({
  uuid: z.string().uuid(),
  title: z.string(),
  description: z.nullable(z.string()),
  tags: z.array(z.string()),
  links: z.array(z.object({ label: z.string(), url: z.string().url() })),
  type: z.string(),
  location: locationSchema,
  organizer: organizerSchema,
  date: simpleDateTimeSchema,
});

export type OlympEvent = z.infer<typeof eventSchema>;

export async function loadPublishedEvents(): Promise<OlympEvent[]> {
  const response = await fetch(elysium("/calendar/v2"));
  const json = (await response.json()) as unknown;

  return z.array(eventSchema).parse(json);
}
