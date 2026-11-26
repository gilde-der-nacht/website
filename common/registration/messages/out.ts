import { z } from "astro/zod";
import { AccountForm } from "@registration/state/account";
import { SaveForm } from "@registration/state/save";

const registerSchema = z.object({
  kind: z.literal("REGISTER"),
  configUuid: z.uuid(),
  registrationUuid: z.uuid(),
});

const requestViewSchema = z.object({
  kind: z.literal("REQUEST_VIEW"),
});

const syncViewSchema = z.object({
  kind: z.literal("SYNC_VIEW"),
  currentRevision: z.number(),
  form: z.object({
    myAccount: AccountForm.rawSchema,
    save: SaveForm.rawSchema,
  }),
});

export const messagesOutSchema = z.union([
  registerSchema,
  requestViewSchema,
  syncViewSchema,
]);

export type MessageOut = z.infer<typeof messagesOutSchema>;
