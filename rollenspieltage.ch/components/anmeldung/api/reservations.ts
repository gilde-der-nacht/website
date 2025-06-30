import { z } from "astro/zod";
import type { ParseResult, Result } from "@rst/components/anmeldung/api/utils";
import { mockedLoadReservations } from "@rst/components/anmeldung/api/mock";
import { elysiumLoadReservations } from "@rst/components/anmeldung/api/elysium";

/*
 * Types
 */

const reservationServerSchema = z.object({
  uuid: z.string().uuid(),
  name: z.string(),
});

export const reservationsServerSchema = z.object({
  entries: z.array(reservationServerSchema),
});
export type ReservationsServer = z.infer<typeof reservationsServerSchema>;

const reservationClientSchema = reservationServerSchema;
export type ReservationClient = z.infer<typeof reservationClientSchema>;

export const reservationsClientSchema = reservationsServerSchema;
export type ReservationsClient = z.infer<typeof reservationsClientSchema>;

/*
 * Methods
 */

export async function loadReservations(
  secret: string,
  uuids: string[],
): Promise<Result<ReservationsClient>> {
  const registrations =
    secret === "demo"
      ? await mockedLoadReservations(uuids)
      : await elysiumLoadReservations(secret, uuids);

  if (registrations.kind === "FAILURE") {
    console.error("Unexpected error. Maybe network, maybe server error.");
    return {
      kind: "FAILURE",
    };
  }

  const parseResult = reservationsServerSchema.safeParse(registrations.data);

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
  s: ReservationsServer,
): ParseResult<ReservationsClient> {
  return reservationsClientSchema.safeParse(s);
}
