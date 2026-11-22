import { Temporal } from "@js-temporal/polyfill";
import { z } from "astro/zod";

const roleSchema = z.union([
  z.literal("admin"),
  z.literal("editor"),
  z.literal("bear"),
]);

const configSchema = z.object({
  label: z.string(),
  config: z.object({
    newRegistration: z.object({
      roles: z.array(roleSchema),
    }),
  }),
});

const plainDateTimeSchema = z
  .string()
  .transform((str) => Temporal.PlainDateTime.from(str));

const defaultViewSchema = z.object({
  ts: plainDateTimeSchema,
  myAccount: z.object({
    name: z.string(),
    email: z.nullable(z.string()),
    mobile: z.nullable(z.string()),
    roles: z.array(roleSchema),
  }),
});

const adminViewSchema = defaultViewSchema.extend({
  config: configSchema,
});

const sendViewSchema = z.object({
  kind: z.literal("UPDATE_VIEW"),
  data: z.union([
    z.object({
      kind: z.literal("DEFAULT"),
      data: defaultViewSchema,
    }),
    z.object({
      kind: z.literal("ADMIN"),
      data: adminViewSchema,
    }),
  ]),
});

export const messagesInSchema = z.union([sendViewSchema]);

export type MessageIn = z.infer<typeof messagesInSchema>;
