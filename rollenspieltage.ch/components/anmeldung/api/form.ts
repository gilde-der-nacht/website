import { z } from "astro/zod";

export const textInputSchema = z.string().transform((value) => {
  return {
    value,
    isDirty: false,
  };
});

export const numberInputSchema = z.number().transform((value) => {
  return {
    value,
    isDirty: false,
  };
});
