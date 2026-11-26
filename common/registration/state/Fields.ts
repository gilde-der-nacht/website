import { field } from "@registration/state/codec";
import { z } from "astro/zod";

export function VersionField<const T extends number>(n: T) {
  return field({
    raw: z.literal(n),
    parsed: z.literal(n),
  });
}

export function DateField() {
  return field({
    raw: z.string(),
    parsed: z.string().transform((str, ctx) => {
      try {
        return Temporal.PlainDate.from(str);
      } catch {
        ctx.addIssue(`invalid PlainDate: "${str}"`);
        return z.NEVER;
      }
    }),
  });
}

export function DateTimeField() {
  return field({
    raw: z.string(),
    parsed: z.string().transform((str, ctx) => {
      try {
        return Temporal.PlainDateTime.from(str);
      } catch {
        ctx.addIssue(`invalid PlainDateTime: "${str}"`);
        return z.NEVER;
      }
    }),
  });
}

export function TimeField() {
  return field({
    raw: z.string(),
    parsed: z.string().transform((str, ctx) => {
      try {
        return Temporal.PlainTime.from(str);
      } catch {
        ctx.addIssue(`invalid PlainTime: "${str}"`);
        return z.NEVER;
      }
    }),
  });
}

export function StringField() {
  return field({
    raw: z.string(),
    parsed: z.string(),
  });
}

export function LiteralField<const U extends readonly string[]>(union: U) {
  return field({
    raw: z.enum(union).readonly(),
    parsed: z.enum(union).readonly(),
  });
}
