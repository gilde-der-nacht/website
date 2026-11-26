import { Temporal } from "@js-temporal/polyfill";

export type RestaurantBase = {
  kind: "restaurant";
  id: string;
  label: string;
  menuLink: string;
  comment: string;
  created: Temporal.PlainDateTime;
  updated: Temporal.PlainDateTime;
};

export type OrderBase = {
  kind: "order";
  restaurantId: string;
  id: string;
  orderer: string;
  comment: string;
  timeWindow: number;
  created: Temporal.PlainDateTime;
  updated: Temporal.PlainDateTime;
};

export type EntryBase = {
  kind: "entry";
  orderId: string;
  id: string;
  eater: string;
  menuItem: string;
  comment: string;
  created: Temporal.PlainDateTime;
  updated: Temporal.PlainDateTime;
};
