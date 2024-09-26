import type {
  EntryBase,
  OrderBase,
  RestaurantBase,
} from "@hhh/components/webapp/util/BasicTypes";
import { DateTime } from "luxon";

export type RestaurantStatus = "active" | "inactive" | "deleted";
export type OrderStatus = "auto" | "active" | "inactive" | "deleted";
export type EntryStatus = "active" | "inactive" | "deleted";

export type RestaurantCreatePost = Omit<RestaurantGet, "created" | "updated">;
export type OrderCreatePost = Omit<OrderGet, "created" | "updated">;
export type EntryCreatePost = Omit<EntryGet, "created" | "updated">;

export type RestaurantUpdatePost = RestaurantCreatePost & { created: DateTime };
export type OrderUpdatePost = OrderCreatePost & { created: DateTime };
export type EntryUpdatePost = EntryCreatePost & { created: DateTime };

export type RestaurantGet = RestaurantBase & {
  status: RestaurantStatus;
};

export type OrderGet = OrderBase & {
  status: OrderStatus;
};

export type EntryGet = EntryBase & {
  status: EntryStatus;
};

export type OlympResponse = RestaurantGet | OrderGet | EntryGet;

export type RawServerData = {
  publicBody: string;
  timestamp: string;
};
