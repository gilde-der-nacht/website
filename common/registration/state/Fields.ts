import { field } from "@registration/state/codec";
import { z } from "astro/zod";

export function VersionField<T extends number>(n: T) {
  return field({
    raw: z.literal(n),
    domain: z.literal(n),
  });
}

export function DateField() {
  return field({
    raw: z.string(),
    domain: z.string().transform((str, ctx) => {
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
    domain: z.string().transform((str, ctx) => {
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
    domain: z.string().transform((str, ctx) => {
      try {
        return Temporal.PlainTime.from(str);
      } catch {
        ctx.addIssue(`invalid PlainTime: "${str}"`);
        return z.NEVER;
      }
    }),
  });
}
