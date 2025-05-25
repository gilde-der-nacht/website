import { z } from "astro/zod";
import type { ParseResult, Result } from "@rst/components/anmeldung/api/utils";
import { mockedLoadRegistrations } from "@rst/components/anmeldung/api/mock";

/*
 * Types
 */

export const registrationsServerSchema = z.object({
  entries: z.array(
    z.object({
      uuid: z.string().uuid(),
      name: z.string(),
    }),
  ),
});
export type RegistrationsServer = z.infer<typeof registrationsServerSchema>;

export const RegistrationsClientSchema = registrationsServerSchema;
export type RegistrationsClient = z.infer<typeof RegistrationsClientSchema>;

/*
 * Methods
 */

export async function loadRegistrations(
  secret: string,
  uuids: string[],
): Promise<Result<RegistrationsClient>> {
  if (secret !== "demo") {
    return {
      kind: "FAILURE",
    };
  }

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
