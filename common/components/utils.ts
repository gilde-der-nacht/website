const dateFormat = new Intl.DateTimeFormat("de-CH", {
  dateStyle: "long",
});

export function formatDate(date: Date): string {
  return dateFormat.format(date);
}

const dateTimeFormat = new Intl.DateTimeFormat("de-CH", {
  timeStyle: "short",
  dateStyle: "long",
  timeZone: "Europe/Zurich",
});

export function formatDateTime(date: Date): string {
  return dateTimeFormat.format(date);
}

export function formatDateRange(from: Date, to: Date): string {
  const sameYear = from.getFullYear() === to.getFullYear();
  const sameMonth = from.getMonth() === to.getMonth();

  const endFormatter = new Intl.DateTimeFormat("de-CH", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  if (sameYear && sameMonth) {
    const startFormatter = new Intl.DateTimeFormat("de-CH", {
      day: "numeric",
    });
    return `${startFormatter.format(from)}. bis ${endFormatter.format(to)}`;
  }
  if (sameYear) {
    const startFormatter = new Intl.DateTimeFormat("de-CH", {
      day: "numeric",
      month: "long",
    });
    return `${startFormatter.format(from)} bis ${endFormatter.format(to)}`;
  }
  const startFormatter = new Intl.DateTimeFormat("de-CH", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return `${startFormatter.format(from)} bis ${endFormatter.format(to)}`;
}

type WithDate = { date: string | Date };
export function sortByDate(a: WithDate, b: WithDate): number {
  return new Date(b.date).getTime() - new Date(a.date).getTime();
}

export function isFutureDate(date: Date | string): boolean {
  const now = new Date();
  const entryDate = new Date(date);
  return now < entryDate;
}

export function isNotProduction(): boolean {
  return import.meta.env.DEV || import.meta.env.ENV === "test";
}
