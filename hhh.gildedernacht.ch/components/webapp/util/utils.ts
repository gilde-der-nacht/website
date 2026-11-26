import type { ToastOptions } from "@hhh/components/webapp/components/static/Toast";
import type { PageType } from "@hhh/components/webapp/pages/util/Router";
import type {
  AppState,
  OrderState,
} from "@hhh/components/webapp/util/StateTypes";
import { Temporal } from "@js-temporal/polyfill";
import type { Setter } from "solid-js";

export const isEmpty = (s: string): boolean => {
  return s.trim().length === 0;
};

export const isValidUrl = (s: string): boolean => {
  if (s.trim().length === 0) {
    return false;
  }
  return s.startsWith("https://");
};

export const isPromise = (p: any): p is Promise<any> => {
  return typeof p === "object" && typeof p.then === "function";
};

export const formatDate = (date: Temporal.PlainDateTime): string =>
  date.toLocaleString("de-DE", { dateStyle: "medium", timeStyle: "short" }) +
  " Uhr";

export const formatDateForHumans = (date: Temporal.PlainDateTime): string =>
  formatDate(date);

type TimeDelta = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const getDelta = (
  first: Temporal.PlainDateTime,
  second: Temporal.PlainDateTime,
): TimeDelta => {
  const d = first.since(second, { largestUnit: "day", smallestUnit: "second" });
  return {
    days: d.days ?? 0,
    hours: d.hours ?? 0,
    minutes: d.minutes ?? 0,
    seconds: d.seconds ?? 0,
  };
};

export const hasBeenUpdated = (o: {
  created: Temporal.PlainDateTime;
  updated: Temporal.PlainDateTime;
}): boolean => {
  const delta = getDelta(o.updated, o.created).seconds;
  return delta > 0;
};

export const link = (setter: Setter<AppState>) => (page: PageType) => {
  if (page === "start") {
    setter((prev) => ({ ...prev, activeOrder: null }));
  }
  setter((prev) => ({ ...prev, page }));
};

export const setToast = (setter: Setter<AppState>) => (o: ToastOptions) => {
  setter((prev) => ({ ...prev, toast: o }));
};

export const hideToast = (setter: Setter<AppState>) => () => {
  setter((prev) => ({
    ...prev,
    toast: { ...prev.toast, isVisible: false },
  }));
};

export const setShowRestaurantList =
  (setter: Setter<AppState>) => (s: boolean) => {
    setter((prev) => ({ ...prev, showRestaurantList: s }));
  };

export const setShowOrderList = (setter: Setter<AppState>) => (s: boolean) => {
  setter((prev) => ({ ...prev, showOrderList: s }));
};

export const setShowEntryList = (setter: Setter<AppState>) => (s: boolean) => {
  setter((prev) => ({ ...prev, showEntryList: s }));
};

export const setActiveOrder =
  (setter: Setter<AppState>) => (o: null | OrderState) => {
    setter((prev) => ({ ...prev, activeOrder: o }));
  };
