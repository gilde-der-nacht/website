import { z } from "astro/zod";
import {
  elysiumLoadAdmin,
  type Result,
} from "@lst/components/anmeldung/api/elysium";
import { daySchema } from "@common/utils/time";

/*
 * Types
 */

const erklaerbaerEntrySchema = z.object({
  name: z.string(),
  slot: z.object({
    day: daySchema,
    from: z.number(),
    to: z.number(),
  }),
});

export type ErklaerbaerAdminEntry = z.infer<typeof erklaerbaerEntrySchema>;

const adminHelpEntryBaseSchema = z.object({
  uuid: z.uuid(),
  name: z.string(),
});

const adminHelpEntryASchema = adminHelpEntryBaseSchema.extend({
  helpType: z.string(),
  slot: z.object({
    start: z.object({
      day: daySchema,
      time: z.string(),
    }),
    end: z.object({
      day: daySchema,
      time: z.string(),
    }),
  }),
});

export type AdminHelpEntryA = z.infer<typeof adminHelpEntryASchema>;
const adminHelpEntryBSchema = adminHelpEntryBaseSchema.extend({
  ref: z.uuid(),
});

const adminHelpEntrySchema = z.union([
  adminHelpEntryASchema,
  adminHelpEntryBSchema,
]);

const adminReservationSchema = z.object({ uuid: z.uuid(), name: z.string() });

export type AdminHelpEntry = z.infer<typeof adminHelpEntrySchema>;

const adminSchema = z.object({
  help: z.array(adminHelpEntrySchema),
  programReservation: z.array(adminReservationSchema),
});

const erklaerbaerSchema = z.object({
  entries: z.array(erklaerbaerEntrySchema),
});

export type ErklaerbaerAdmin = z.infer<typeof erklaerbaerSchema>;

const publicAdminSchema = z.object({
  admin: z.nullable(adminSchema),
  erklaerbaer: z.nullable(erklaerbaerSchema),
});

export type PublicAdmin = z.infer<typeof publicAdminSchema>;

/*
 * Methods
 */

export async function loadAdmin(secret: string): Promise<Result<PublicAdmin>> {
  const program = await elysiumLoadAdmin(secret);

  if (program.kind === "FAILURE") {
    console.error("Unexpected error. Maybe network, maybe server error.");
    return {
      kind: "FAILURE",
    };
  }

  const parseResult = publicAdminSchema.safeParse(program.data);

  if (!parseResult.success) {
    return {
      kind: "FAILURE",
    };
  }

  return {
    kind: "SUCCESS",
    data: parseResult.data,
  };
}
