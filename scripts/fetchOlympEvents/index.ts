import { createDirectus, readItems, rest } from "@directus/sdk";

type OlympLocation = {
  id: number;
  label: string;
  label_long: string | null;
  virtuel: boolean;
  url: string | null;
};

type OlympOrganizer = {
  id: number;
  name: string;
  url: string | null;
};

type OlympType = {
  id: number;
  label: string;
  description: string | null;
};

type OlympTag = {
  tags_id: {
    id: number;
    label: string;
  };
};

type OlympLink = {
  links_id: {
    id: number;
    label: string;
    url: string;
  };
};

type OlympEvent = {
  id: number;
  title: string;
  description: string | null;
  start: string;
  end: string;
  type_of_time:
  | "one_partial_day"
  | "multiple_partial_days"
  | "one_full_day"
  | "multiple_full_days";
  location: OlympLocation;
  organizer: OlympOrganizer;
  type: OlympType;
  tags: OlympTag[];
  links: OlympLink[];
};

type OlympSchema = {
  events: OlympEvent[];
};

const client = createDirectus<OlympSchema>(
  "https://olymp.gildedernacht.ch/"
).with(rest());

const res = await client.request<OlympEvent[]>(
  readItems("events", {
    fields: [
      "id",
      "title",
      "description",
      "start",
      "end",
      "type_of_time",

      { location: ["id", "label", "label_long", "virtuel", "url "] },
      { organizer: ["id", "name", "url"] },
      { type: ["id", "label", "description"] },
      { tags: [{ tags_id: ["id", "label"] }] },
      { links: [{ links_id: ["id", "label", "url"] }] },
    ],
    filter: {
      "status": {
        "_eq": "published",
      },
    },
  })
);

const flattened = res.map((event) => ({
  ...event,
  tags: [...event.tags.map((tag) => tag.tags_id)],
  links: [...event.links.map((link) => link.links_id)],
}));

const file = Bun.file("./out/olymp.json", { type: "application/json" });

await Bun.write(file, JSON.stringify(flattened, null, 2));
