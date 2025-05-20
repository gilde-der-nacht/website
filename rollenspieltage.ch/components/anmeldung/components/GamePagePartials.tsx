import type { GameMasterRoundNew } from "../data";

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

export function validateGameRound(
  form: GameMasterRoundNew,
): GameRoundEditErrors {
  const titleMissing = form.titel.trim().length === 0;

  const descriptionShortMissing = form.descriptionShort.trim().length === 0;

  const descriptionShortTooLong =
    form.descriptionShort.length > DESCR_SHORT_MAX_CHAR;

  const descriptionLongTooLong =
    form.descriptionLong.length > DESCR_LONG_MAX_CHAR;

  const slotMissing =
    form.slots["SATURDAY"].concat(form.slots["SUNDAY"]).length === 0;

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
