import "core-js/full/object/group-by";

export function mapGroupBy<K extends PropertyKey, T, V>(
  items: Iterable<T>,
  keySelector: (item: T, index: number) => K,
  mapValues: (items: T[]) => V,
): { [key in K]: V } {
  const grouped = Object.groupBy(items, keySelector);
  const entries = Object.entries(grouped) as [K, T[]][];
  const mapped = entries.map(
    ([key, values]) => [key, mapValues(values)] as const,
  );
  return Object.fromEntries(mapped) as { [key in K]: V };
}
