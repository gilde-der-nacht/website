import { z } from "astro/zod";

const statusSchema = z.enum(["published", "draft", "archived"])

const tagSchema = z.object({
  id: z.number(),
  status: statusSchema,
  label: z.string()
})

const linkSchema = z.object({
  id: z.number(),
  status: statusSchema,
  label: z.string(),
  url: z.string()
})

const locationSchema = z.object({
  id: z.number(),
  status: statusSchema,
  label: z.string(),
  url: z.nullable(z.string()),
  virtuel: z.boolean(),
  label_long: z.nullable(z.string()),
  comment: z.nullable(z.string())
})

const typeSchema = z.object({
  id: z.number(),
  status: statusSchema,
  label: z.string(),
  description: z.nullable(z.string())
})

const organizerSchema = z.object({
  id: z.number(),
  status: statusSchema,
  name: z.string(),
  url: z.nullable(z.string())
});

const typeOfTimeSchema = z.enum(["one_partial_day", "multiple_partial_days", "one_full_day", "multiple_full_days"])

const eventSchema = z.object({
  id: z.number(),
  status: statusSchema,
  title: z.string(),
  type_of_time: typeOfTimeSchema,
  start: z.coerce.date(),
  end: z.coerce.date(),
  description: z.nullable(z.string()),
  googleCalendarId: z.string(),
  tags: z.array(z.object({ tags_id: tagSchema })),
  links: z.array(z.object({ links_id: linkSchema })),
  location: locationSchema,
  type: typeSchema,
  organizer: organizerSchema,
});

export type OlympEvent = z.infer<typeof eventSchema>;

export async function loadEvents(): Promise<OlympEvent[]> {
  const eventsUrl = new URL("https://olymp.gildedernacht.ch/items/events");
  eventsUrl.searchParams.append("filter[status][_eq]", "published");
  eventsUrl.searchParams.append("fields[]", "*");
  eventsUrl.searchParams.append("fields[]", "location.*");
  eventsUrl.searchParams.append("fields[]", "organizer.*");
  eventsUrl.searchParams.append("fields[]", "type.*");
  eventsUrl.searchParams.append("fields[]", "links.links_id.*");
  eventsUrl.searchParams.append("fields[]", "tags.tags_id.*");

  const response = await fetch(eventsUrl);
  const json = await response.json() as unknown;

  const parsed = z.object({data: z.array(eventSchema)}).parse(json);

  return parsed.data;
}
