import type { ToastOptions } from "@hhh/components/webapp/components/static/Toast";
import type { PageType } from "@hhh/components/webapp/pages/util/Router";
import type {
  EntryBase,
  OrderBase,
  RestaurantBase,
} from "@hhh/components/webapp/util/BasicTypes";
import { z } from "astro/zod";
import type { ZodTypeAny } from "astro:schema";
import { DateTime } from "luxon";

/* SERVER SIDE TYPES */

/* ALL TYPES */

const statusParser = z.enum(["published", "archived"]);
const metaDataParser = z.object({
  date_created: z.string(),
  date_updated: z.nullable(z.string()),
});

/* RESTAURANTS */

const restaurantCreate = z.object({
  status: statusParser,
  name: z.string(),
  link: z.string(),
  comment: z.nullable(z.string()),
});
export type RestaurantCreate = z.infer<typeof restaurantCreate>;
const restaurantUpdate = restaurantCreate.extend({
  uuid: z.string(),
});
export type RestaurantUpdate = z.infer<typeof restaurantUpdate>;

export const restaurantParser = restaurantUpdate.merge(metaDataParser);
export type Restaurant = z.infer<typeof restaurantParser>;

/* ORDERS */

const orderCreate = z.object({
  status: statusParser,
  restaurant: z.string(),
  orderer: z.string(),
  time_window: z.number(),
  comment: z.nullable(z.string()),
});
export type OrderCreate = z.infer<typeof orderCreate>;
const orderUpdate = orderCreate.extend({
  uuid: z.string(),
});
export type OrderUpdate = z.infer<typeof orderUpdate>;

export const orderParser = orderUpdate.merge(metaDataParser);
export type Order = z.infer<typeof orderParser>;

/* ENTRIES */

const entryCreate = z.object({
  status: statusParser,
  order: z.string(),
  eater: z.string(),
  menu_item: z.string(),
  comment: z.nullable(z.string()),
});
export type EntryCreate = z.infer<typeof entryCreate>;
const entryUpdate = entryCreate.extend({
  uuid: z.string(),
});
export type EntryUpdate = z.infer<typeof entryUpdate>;

export const entryParser = entryUpdate.merge(metaDataParser);
export type Entry = z.infer<typeof entryParser>;

export function getOlympParser<P extends ZodTypeAny>(parser: P) {
  return {
    safeParse: (data: unknown) => {
      const parsed = z.object({ data: z.array(parser) }).safeParse(data);
      if (parsed.success) {
        return { ...parsed, data: parsed.data.data };
      }
      return parsed;
    },
  };
}

/* CLIENT SIDE TYPES */

export type DerivedRestaurantStatus = "active" | "inactive";
export type DerivedOrderStatus = "active" | "inactive";
export type DerivedEntryStatus = "active" | "inactive";

export type RestaurantState = RestaurantBase & {
  status: DerivedRestaurantStatus;
};

export type OrderState = OrderBase & {
  status: DerivedOrderStatus;
};

export type EntryState = EntryBase & {
  status: DerivedEntryStatus;
};

export type AppData = {
  restaurants: {
    active: readonly RestaurantState[];
    inactive: readonly RestaurantState[];
  };
  orders: { active: readonly OrderState[]; inactive: readonly OrderState[] };
  entries: { active: readonly EntryState[]; inactive: readonly EntryState[] };
  now: DateTime;
};

export type AppState = {
  page: PageType;
  activeOrder: null | OrderState;
  toast: ToastOptions;
  showRestaurantList: boolean;
  showOrderList: boolean;
  showEntryList: boolean;
};
