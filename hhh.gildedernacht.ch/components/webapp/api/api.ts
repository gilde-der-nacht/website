import { aggragateData } from "@hhh/components/webapp/api/aggregate";
import { EntryAPI } from "@hhh/components/webapp/api/entry-api";
import OLYMP from "@hhh/components/webapp/api/olymp";
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
  const data = await OLYMP.GET();
  return aggragateData(data, now);
};

export default (props: ApiProps) => ({
  restaurant: RestaurantAPI(props),
  order: OrderAPI(props),
  entry: EntryAPI(props),
});
