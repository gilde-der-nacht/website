import { z } from "astro/zod";
import type { JSX } from "solid-js";

const roleSchema = z.union([z.literal("admin")]);
export type Role = z.infer<typeof roleSchema>;

const contactSchema = z.union([
  z.object({
    kind: z.literal("INITIAL"),
  }),
  z.object({
    kind: z.literal("LOADED"),
    name: z.string(),
    email: z.string(),
    mobile: z.string(),
    roles: z.array(roleSchema),
    viewAs: z.object({
      registrationUuid: z.string().brand<"RegistrationUuid">(),
      roles: z.array(roleSchema),
    }),
  }),
]);

export type Contact = z.infer<typeof contactSchema>;

export function getInitialContact(): Contact {
  return {
    kind: "INITIAL",
  };
}

export function Contact(): JSX.Element {
  return <h1></h1>;
}
