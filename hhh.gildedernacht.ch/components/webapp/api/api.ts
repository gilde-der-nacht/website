import { aggregateServerData } from "@hhh/components/webapp/api/aggregate";
import { EntryAPI } from "@hhh/components/webapp/api/entry-api";
import {
  loadRecentEntries,
  loadRecentOrders,
  loadRestaurants,
} from "@hhh/components/webapp/api/olymp";
import { OrderAPI } from "@hhh/components/webapp/api/order-api";
import { RestaurantAPI } from "@hhh/components/webapp/api/restaurant-api";
import type { ToastOptions } from "@hhh/components/webapp/components/static/Toast";
import type { AppData } from "@hhh/components/webapp/util/StateTypes";
import { DateTime } from "luxon";

export type ApiProps = {
  refetch: Refetcher;
  setToast: (o: ToastOptions) => void;
};

export type Refetcher = (
  info?: unknown,
) => AppData | Promise<AppData | undefined> | null | undefined;

export const loadServerResource = async (now: DateTime): Promise<AppData> => {
  const [restaurants, orders, entries] = await Promise.all([
    loadRestaurants(),
    loadRecentOrders(),
    loadRecentEntries(),
  ]);

  const aggregatedData = aggregateServerData({ restaurants, orders, entries });
  return { ...aggregatedData, now };
};

export default (props: ApiProps) => ({
  restaurant: RestaurantAPI(props),
  order: OrderAPI(props),
  entry: EntryAPI(props),
});
