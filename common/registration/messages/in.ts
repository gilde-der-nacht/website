import { Temporal } from "@js-temporal/polyfill";
import { z } from "astro/zod";
import { SaveForm } from "@registration/state/save";
import { AccountForm } from "@registration/state/account";

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
  currentRevision: z.number(),
  myAccount: AccountForm.wireSchema,
  save: SaveForm.wireSchema,
});

const adminViewSchema = defaultViewSchema.extend({
  config: configSchema,
});

const updateViewSchema = z.object({
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

export type UpdateView = z.infer<typeof updateViewSchema>;

export const messagesInSchema = z.union([updateViewSchema]);

export type MessageIn = z.infer<typeof messagesInSchema>;
