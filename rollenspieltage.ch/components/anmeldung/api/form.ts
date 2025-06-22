import { z } from "astro/zod";

export const textInputSchema = z.string().transform((value) => {
  return {
    value,
    isDirty: false,
  };
});

export type TextInput = z.infer<typeof textInputSchema>;

export function initTextInput(value: string): TextInput {
  return { value, isDirty: false };
}

export const numberInputSchema = z.number().transform((value) => {
  return {
    value,
    isDirty: false,
  };
});
export type NumberInput = z.infer<typeof numberInputSchema>;

export function initNumberInput(value: number): NumberInput {
  return { value, isDirty: false };
}
