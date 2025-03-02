import { z } from "astro/zod";
import { elysium } from "./utils";

const statusSchema = z.enum(["published", "draft", "archived"]);

const locationSchema = z.object({
  label: z.string(),
  labelLong: z.nullable(z.string()),
  virtual: z.boolean(),
  url: z.nullable(z.string()),
  comment: z.nullable(z.string()),
});

const typeSchema = z.object({
  label: z.string(),
  description: z.nullable(z.string()),
});

const organizerSchema = z.object({
  name: z.string(),
  url: z.nullable(z.string()),
});

const eventSchema = z.object({
  id: z.number(),
  status: statusSchema,
  title: z.string(),
  description: z.nullable(z.string()),
  googleCalendarId: z.nullable(z.string()),
  date: z.object({
    multipleDays: z.boolean(),
    fullDay: z.boolean(),
    start: z.coerce.date(),
    end: z.coerce.date(),
  }),
  tags: z.array(z.string()),
  links: z.array(
    z.object({
      label: z.string(),
      url: z.string(),
    }),
  ),
  location: locationSchema,
  type: typeSchema,
  organizer: organizerSchema,
});

export type OlympEvent = z.infer<typeof eventSchema>;

export async function loadPublishedEvents(): Promise<OlympEvent[]> {
  const response = await fetch(elysium("/calendar"));
  const json = (await response.json()) as unknown;

  const parsed = z.array(eventSchema).parse(json);

  return parsed.filter((event) => event.status === "published");
}
