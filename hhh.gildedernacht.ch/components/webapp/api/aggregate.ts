import type {
  EntryGet,
  OrderGet,
  RestaurantGet,
} from "@hhh/components/webapp/api/ApiTypes";
import type {
  AppData,
  DerivedOrderStatus,
  EntryState,
  OrderState,
  RestaurantState,
} from "@hhh/components/webapp/util/StateTypes";
import { getDelta } from "@hhh/components/webapp/util/utils";
import { DateTime } from "luxon";

export const CUT_OFF_TIME_HOURS = 24;

export const aggragateData = (
  data: (RestaurantGet | OrderGet | EntryGet)[],
  now: DateTime,
): AppData => {
  const allRestaurants = data
    .filter((d): d is RestaurantGet => d.kind === "restaurant")
    .filter((r): r is RestaurantState => r.status !== "deleted");
  const restaurants = {
    active: allRestaurants.filter((r) => r.status === "active"),
    inactive: allRestaurants.filter((r) => r.status === "inactive"),
  };

  const allOrders = data
    .filter((d): d is OrderGet => d.kind === "order")
    .filter((o) => o.status !== "deleted")
    .filter((o) => {
      const delta = getDelta(now, o.created.plus({ minutes: o.timeWindow }));
      return delta.days === 0 && delta.hours <= CUT_OFF_TIME_HOURS;
    })
    .filter((o) => restaurants.active.map((r) => r.id).includes(o.restaurantId))
    .map((o): OrderState => {
      if (o.status === "auto") {
        const delta = getDelta(o.created.plus({ minutes: o.timeWindow }), now);
        const status = delta.minutes > 0 ? "active" : "inactive";
        return { ...o, status };
      }
      return { ...o, status: o.status as DerivedOrderStatus };
    });

  const orders = {
    active: allOrders.filter((o) => o.status === "active"),
    inactive: allOrders.filter((o) => o.status === "inactive"),
  };

  const allEntries = data
    .filter((d): d is EntryGet => d.kind === "entry")
    .filter((e): e is EntryState => e.status !== "deleted")
    .filter((e) => allOrders.map((o) => o.id).includes(e.orderId));

  const entries = {
    active: allEntries.filter((e) => e.status === "active"),
    inactive: allEntries.filter((e) => e.status === "inactive"),
  };

  return {
    restaurants,
    orders,
    entries,
    now,
  };
};
