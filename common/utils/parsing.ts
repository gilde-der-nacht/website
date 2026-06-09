export function parseInt(input: string): number | null {
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
