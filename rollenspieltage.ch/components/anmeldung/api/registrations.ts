import { z } from "astro/zod";
import type { ParseResult, Result } from "@rst/components/anmeldung/api/utils";
import { mockedLoadRegistrations } from "@rst/components/anmeldung/api/mock";

/*
 * Types
 */

const registrationServerSchema = z.object({
  uuid: z.string().uuid(),
  name: z.string(),
});

export const registrationsServerSchema = z.object({
  entries: z.array(registrationServerSchema),
});
export type RegistrationsServer = z.infer<typeof registrationsServerSchema>;

const registrationClientSchema = registrationServerSchema;
export type RegistrationClient = z.infer<typeof registrationClientSchema>;

export const RegistrationsClientSchema = registrationsServerSchema;
export type RegistrationsClient = z.infer<typeof RegistrationsClientSchema>;

/*
 * Methods
 */

export async function loadRegistrations(
  secret: string,
  uuids: string[],
): Promise<Result<RegistrationsClient>> {
  // TODO: implement non-mock version
  console.log("loadRegistration still mocked", secret.substring(0, 4), "...");

  const registrations = await mockedLoadRegistrations(uuids);
  const parseResult = registrationsServerSchema.safeParse(registrations);

  if (!parseResult.success) {
    return {
      kind: "FAILURE",
    };
  }
  const transformResult = transformRegistrationsFromServer(parseResult.data);
  if (!transformResult.success) {
    return {
      kind: "FAILURE",
    };
  }

  return {
    kind: "SUCCESS",
    data: transformResult.data,
  };
}

function transformRegistrationsFromServer(
  s: RegistrationsServer,
): ParseResult<RegistrationsClient> {
  return RegistrationsClientSchema.safeParse(s);
}
