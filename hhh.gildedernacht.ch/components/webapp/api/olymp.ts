import {
  entryParser,
  getOlympParser,
  orderParser,
  restaurantParser,
  type Entry,
  type Order,
  type Restaurant,
} from "../util/StateTypes";

export const BASE_ENDPOINT = new URL("https://olymp.gildedernacht.ch");
export const ENDPOINTS = {
  RESTAURANTS: new URL("items/hhh_restaurants", BASE_ENDPOINT),
  ORDERS: new URL("items/hhh_orders", BASE_ENDPOINT),
  ENTRIES: new URL("items/hhh_entries", BASE_ENDPOINT),
};

export async function loadRestaurants(): Promise<Restaurant[]> {
  const res = await fetch(ENDPOINTS.RESTAURANTS);
  const restaurants = (await res.json()) as unknown;
  const parser = getOlympParser(restaurantParser);
  const parsed = parser.safeParse(restaurants);
  if (parsed.success) {
    return parsed.data;
  }
  console.error(parsed.error);
  return [];
}

export async function loadRecentOrders(): Promise<Order[]> {
  const url = new URL(ENDPOINTS.ORDERS);
  url.searchParams.append("filter[date_created][_lt]", "$NOW(+1 day)");
  const res = await fetch(url.href);
  const orders = (await res.json()) as unknown;

  const parser = getOlympParser(orderParser);
  const parsed = parser.safeParse(orders);

  if (parsed.success) {
    return parsed.data;
  }
  console.error(parsed.error);
  return [];
}
export async function loadRecentEntries(): Promise<Entry[]> {
  const url = new URL(ENDPOINTS.ENTRIES);
  url.searchParams.append("filter[date_created][_lt]", "$NOW(+1 day)");
  const res = await fetch(url.href);
  const entries = (await res.json()) as unknown;
  const parser = getOlympParser(entryParser);
  const parsed = parser.safeParse(entries);

  if (parsed.success) {
    return parsed.data;
  }
  console.error(parsed.error);
  return [];
}
