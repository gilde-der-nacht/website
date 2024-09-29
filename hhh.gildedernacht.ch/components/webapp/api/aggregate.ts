import type {
  AppData,
  Entry,
  EntryState,
  Order,
  OrderState,
  Restaurant,
  RestaurantState,
} from "@hhh/components/webapp/util/StateTypes";

import { DateTime } from "luxon";

export const CUT_OFF_TIME_HOURS = 24;

export function aggregateServerData(serverData: {
  restaurants: Restaurant[];
  orders: Order[];
  entries: Entry[];
}): Omit<AppData, "now"> {
  const restaurantViews = serverData.restaurants.map((r) => {
    return {
      kind: "restaurant",
      id: r.uuid,
      status: r.status === "published" ? "active" : "inactive",
      label: r.name,
      menuLink: r.link,
      comment: r.comment ?? "",
      created: DateTime.fromISO(r.date_created),
      updated: DateTime.fromISO(r.date_updated ?? r.date_created),
    } satisfies RestaurantState;
  });
  const restaurants = {
    active: restaurantViews.filter((r) => r.status === "active"),
    inactive: restaurantViews.filter((r) => r.status === "inactive"),
  };

  const orderViews = serverData.orders.map((o) => {
    return {
      kind: "order",
      id: o.uuid,
      status: o.status === "published" ? "active" : "inactive",
      restaurantId: o.restaurant,
      orderer: o.orderer,
      timeWindow: o.time_window,
      comment: o.comment ?? "",
      created: DateTime.fromISO(o.date_created),
      updated: DateTime.fromISO(o.date_updated ?? o.date_created),
    } satisfies OrderState;
  });
  const orders = {
    active: orderViews.filter((r) => r.status === "active"),
    inactive: orderViews.filter((r) => r.status === "inactive"),
  };

  const entryViews = serverData.entries.map((e) => {
    return {
      kind: "entry",
      id: e.uuid,
      status: e.status === "published" ? "active" : "inactive",
      orderId: e.order,
      eater: e.eater,
      menuItem: e.menu_item,
      comment: e.comment ?? "",
      created: DateTime.fromISO(e.date_created),
      updated: DateTime.fromISO(e.date_updated ?? e.date_created),
    } satisfies EntryState;
  });
  const entries = {
    active: entryViews.filter((r) => r.status === "active"),
    inactive: entryViews.filter((r) => r.status === "inactive"),
  };

  return {
    restaurants,
    orders,
    entries,
  };
}
