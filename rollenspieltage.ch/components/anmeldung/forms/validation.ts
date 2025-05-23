import type { Store } from "solid-js/store";
import type { GameroundNewEditClient } from "@rst/components/anmeldung/api/gameround-edit";

export const DESCR_SHORT_MAX_CHAR = 200;
export const DESCR_LONG_MAX_CHAR = 500;

export type GameRoundEditErrors = {
  titleMissing: boolean;
  descriptionShortMissing: boolean;
  descriptionShortTooLong: boolean;
  descriptionLongTooLong: boolean;
  slotMissing: boolean;
  hasErrors: boolean;
};

export function validateNewGameround(
  store: Store<GameroundNewEditClient>,
): GameRoundEditErrors {
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
