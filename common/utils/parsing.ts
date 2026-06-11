export function parseIntSafe(input: string): number | null {
  const parsed = Number.parseInt(input);
  if (isNaN(parsed)) {
    return null;
  }
  const stringified = `${parsed}`;
  if (stringified !== input) {
    return null;
  }
  return parsed;
}

export function removeLeadingZeros(input: string): string {
  let removing = true;

  const removed = input
    .split("")
    .map((char) => {
      if (char === "0" && removing) {
        return "";
      }
      removing = false;
      return char;
    })
    .join("");

  return removed.length === 0 ? "0" : removed;
}

export function splitMultiple(str: string, separators: string[]) {
  let tmp = [str];
  separators.forEach((separator) => {
    tmp = tmp.flatMap((el) => el.split(separator));
  });

  return tmp;
}
