import { z } from "astro/zod";
import {
  elysiumLoadPublic,
  type Result,
} from "@lst/components/anmeldung/api/elysium";
import type { PlainDateTimeRange } from "@common/utils/time";
import { Temporal } from "@js-temporal/polyfill";
import { parsePlainDateTime } from "@common/components/events";

/*
 * Types
 */

const dateTimeRangeSchema = z
  .object({
    start: z.string(),
    end: z.string(),
  })
  .transform((value, ctx): PlainDateTimeRange => {
    const { start, end } = value;
    const parsedStart = parsePlainDateTime(start);
    const parsedEnd = parsePlainDateTime(end);

    if (parsedStart.kind === "ERROR") {
      ctx.addIssue({
        code: "custom",
        message: parsedStart.message,
      });
      return z.NEVER;
    }

    if (parsedEnd.kind === "ERROR") {
      ctx.addIssue({
        code: "custom",
        message: parsedEnd.message,
      });
      return z.NEVER;
    }

    return {
      startDate: Temporal.PlainDateTime.from({
        year: parsedStart.value.year,
        month: parsedStart.value.month,
        day: parsedStart.value.day,
        hour: parsedStart.value.hour,
        minute: parsedStart.value.minute,
      }),
      endDate: Temporal.PlainDateTime.from({
        year: parsedEnd.value.year,
        month: parsedEnd.value.month,
        day: parsedEnd.value.day,
        hour: parsedEnd.value.hour,
        minute: parsedEnd.value.minute,
      }),
    };
  });

const publicProgramEntrySchema = z.object({
  uuid: z.string(),
  title: z.string(),
  organizer: z.string(),
  timeSlot: dateTimeRangeSchema,
  shortDescription: z.string(),
  longDescription: z.string(),
  participating: z.union([
    z.object({ kind: z.literal("NONE"), maxSeats: z.number() }),
    z.object({ kind: z.literal("LIMITED"), maxSeats: z.number() }),
  ]),
  tagNames: z.array(z.string()),
});
export type PublicProgramEntry = z.infer<typeof publicProgramEntrySchema>;

const reservationsSchema = z.record(z.string(), z.number());
export type Reservations = z.infer<typeof reservationsSchema>;

const publicSchema = z.object({
  programEntries: z.array(publicProgramEntrySchema),
  reservations: reservationsSchema,
});

export type Public = z.infer<typeof publicSchema>;

/*
 * Methods
 */

export async function loadPublic(): Promise<Result<Public>> {
  const program = await elysiumLoadPublic();

  if (program.kind === "FAILURE") {
    console.error("Unexpected error. Maybe network, maybe server error.");
    return {
      kind: "FAILURE",
    };
  }

  const parseResult = publicSchema.safeParse(program.data);

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
