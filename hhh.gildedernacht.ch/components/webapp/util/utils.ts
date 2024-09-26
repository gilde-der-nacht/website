import type { ToastOptions } from "@hhh/components/webapp/components/static/Toast";
import type { PageType } from "@hhh/components/webapp/pages/util/Router";
import type {
  AppState,
  OrderState,
} from "@hhh/components/webapp/util/StateTypes";
import { DateTime } from "luxon";
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

export const hasProp = <K extends PropertyKey>(
  data: object,
  prop: K,
): data is Record<K, unknown> => {
  return prop in data;
};

export const formatDate = (date: DateTime): string =>
  date.toLocal().toLocaleString(DateTime.DATETIME_MED) + " Uhr";

export const formatDateForHumans = (date: DateTime): string =>
  date.toLocal().toRelative({ locale: "de" }) ?? formatDate(date);

type TimeDelta = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export const getDelta = (first: DateTime, second: DateTime): TimeDelta => {
  return first
    .diff(second, ["days", "hours", "minutes", "seconds"])
    .toObject() as TimeDelta;
};

export const hasBeenUpdated = (o: {
  created: DateTime;
  updated: DateTime;
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
