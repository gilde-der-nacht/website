import type { Store } from "solid-js/store";
import type { GameroundEditClient } from "@rst/components/anmeldung/api/gameround-edit";

export const DESCR_SHORT_MAX_CHAR = 200;
export const DESCR_LONG_MAX_CHAR = 500;
export const UPDATE_MAX_CHAR = 200;

export type GameroundEditErrors = {
  titleMissing: boolean;
  descriptionShortMissing: boolean;
  descriptionShortTooLong: boolean;
  descriptionLongTooLong: boolean;
  slotMissing: boolean;
  hasErrors: boolean;
};

export function validateGameround(
  store: Store<GameroundEditClient>,
): GameroundEditErrors {
  const titleMissing = store.title.value.trim().length === 0;

  const descriptionShortMissing =
    store.description.short.value.trim().length === 0;

  const descriptionShortTooLong =
    store.description.short.value.length > DESCR_SHORT_MAX_CHAR;

  const descriptionLongTooLong =
    store.description.long.value.length > DESCR_LONG_MAX_CHAR;

  const slotMissing = store.slots.length === 0;

  return {
    titleMissing,
    descriptionShortMissing,
    descriptionShortTooLong,
    descriptionLongTooLong,
    slotMissing,
    hasErrors:
      titleMissing ||
      descriptionShortMissing ||
      descriptionShortTooLong ||
      descriptionLongTooLong ||
      slotMissing,
  };
}

export function validateUpdateText(
  store: Store<{ updateText: { value: string } }>,
): { missing: boolean; tooLong: boolean; hasErrors: boolean } {
  const missing = store.updateText.value.trim().length === 0;
  const tooLong = store.updateText.value.length > UPDATE_MAX_CHAR;
  return {
    missing,
    tooLong,
    hasErrors: missing || tooLong,
  };
}
