import { z } from "astro/zod";

export const textInputSchema = z.string().transform((value) => {
  return {
    value,
    isDirty: false,
  };
});

export type TextInput = z.infer<typeof textInputSchema>;

export const numberInputSchema = z.number().transform((value) => {
  return {
    value,
    isDirty: false,
  };
});
export type NumberInput = z.infer<typeof numberInputSchema>;
