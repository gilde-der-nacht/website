import type {
  EntryBase,
  OrderBase,
  RestaurantBase,
} from "@hhh/components/webapp/util/BasicTypes";
import { Temporal } from "@js-temporal/polyfill";

export type RestaurantStatus = "active" | "inactive" | "deleted";
export type OrderStatus = "auto" | "active" | "inactive" | "deleted";
export type EntryStatus = "active" | "inactive" | "deleted";

export type RestaurantCreatePost = Omit<RestaurantGet, "created" | "updated">;
export type OrderCreatePost = Omit<OrderGet, "created" | "updated">;
export type EntryCreatePost = Omit<EntryGet, "created" | "updated">;

export type RestaurantUpdatePost = RestaurantCreatePost & {
  created: Temporal.PlainDateTime;
};
export type OrderUpdatePost = OrderCreatePost & {
  created: Temporal.PlainDateTime;
};
export type EntryUpdatePost = EntryCreatePost & {
  created: Temporal.PlainDateTime;
};

export type RestaurantGet = RestaurantBase & {
  status: RestaurantStatus;
};

export type OrderGet = OrderBase & {
  status: OrderStatus;
};

export type EntryGet = EntryBase & {
  status: EntryStatus;
};
