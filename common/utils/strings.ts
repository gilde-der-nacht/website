export function join(
  list: string[],
  separator: string,
  lastSeparator?: string,
): string {
  return list
    .reduce((acc, curr, i): string[] => {
      if (i === 0) {
        return [curr];
      } else if (i + 1 === list.length) {
        return [...acc, lastSeparator ?? separator, curr];
      } else {
        return [...acc, separator, curr];
      }
    }, [])
    .join("");
}
