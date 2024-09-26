import type {
  EntryGet,
  OlympResponse,
  OrderGet,
  RawServerData,
  RestaurantGet,
} from "@hhh/components/webapp/api/ApiTypes";
import { HHH_VERSION } from "@hhh/components/webapp/api/olymp";
import { hasProp } from "@hhh/components/webapp/util/utils";
import { DateTime } from "luxon";

export const isRestaurant = (
  o: object,
): o is Omit<RestaurantGet, "created" | "updated"> => {
  if (
    !(
      hasProp(o, "kind") &&
      hasProp(o, "id") &&
      hasProp(o, "label") &&
      hasProp(o, "menuLink") &&
      hasProp(o, "comment") &&
      hasProp(o, "status")
    )
  ) {
    return false;
  }
  if (
    o.kind !== "restaurant" &&
    typeof o.id !== "string" &&
    typeof o.label !== "string" &&
    typeof o.menuLink !== "string" &&
    typeof o.comment !== "string" &&
    (typeof o.status !== "string" ||
      !["active", "inactive", "deleted"].includes(o.status))
  ) {
    return false;
  }
  return true;
};

export const isOrder = (
  o: object,
): o is Omit<OrderGet, "created" | "updated"> => {
  if (
    !(
      hasProp(o, "kind") &&
      hasProp(o, "id") &&
      hasProp(o, "restaurantId") &&
      hasProp(o, "orderer") &&
      hasProp(o, "comment") &&
      hasProp(o, "timeWindow") &&
      hasProp(o, "status")
    )
  ) {
    return false;
  }
  if (
    o.kind !== "order" &&
    typeof o.id !== "string" &&
    typeof o.restaurantId !== "string" &&
    typeof o.orderer !== "string" &&
    typeof o.comment !== "string" &&
    typeof o.timeWindow !== "number" &&
    (typeof o.status !== "string" ||
      !["auto", "active", "inactive", "deleted"].includes(o.status))
  ) {
    return false;
  }
  return true;
};

export const isEntry = (
  o: object,
): o is Omit<EntryGet, "created" | "updated"> => {
  if (
    !(
      hasProp(o, "kind") &&
      hasProp(o, "id") &&
      hasProp(o, "orderId") &&
      hasProp(o, "eater") &&
      hasProp(o, "menuItem") &&
      hasProp(o, "comment") &&
      hasProp(o, "status")
    )
  ) {
    return false;
  }
  if (
    o.kind !== "entry" &&
    typeof o.id !== "string" &&
    typeof o.orderId !== "string" &&
    typeof o.eater !== "string" &&
    typeof o.menuItem !== "string" &&
    typeof o.comment !== "string" &&
    (typeof o.status !== "string" ||
      !["active", "inactive", "deleted"].includes(o.status))
  ) {
    return false;
  }
  return true;
};

export const safeParse = (raw: RawServerData): OlympResponse | null => {
  const parsed = JSON.parse(raw.publicBody) as unknown;
  if (typeof parsed !== "object" || parsed === null) {
    return null;
  }
  if (!hasProp(parsed, "version")) {
    return null;
  }
  if (parsed.version !== HHH_VERSION) {
    return null;
  }
  if (isRestaurant(parsed) || isOrder(parsed) || isEntry(parsed)) {
    if (hasProp(parsed, "created") && typeof parsed.created === "string") {
      return {
        ...parsed,
        created: DateTime.fromISO(parsed.created, { zone: "Europe/Zurich" }),
        updated: DateTime.fromISO(raw.timestamp, { zone: "Europe/Zurich" }),
      };
    }
    return {
      ...parsed,
      created: DateTime.fromISO(raw.timestamp, { zone: "Europe/Zurich" }),
      updated: DateTime.fromISO(raw.timestamp, { zone: "Europe/Zurich" }),
    };
  }
  return null;
};
