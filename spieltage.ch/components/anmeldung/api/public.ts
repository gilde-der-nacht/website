import { z } from "astro/zod";
import {
  elysiumLoadPublic,
  type Result,
} from "@lst/components/anmeldung/api/elysium";
import { daySchema } from "@common/utils/time";
import type { Temporal } from "@js-temporal/polyfill";
import { defaultPlainDates } from "@lst/components/anmeldung/constant/time";
import { parsePlainTime } from "@common/components/events";
import { getErrors } from "@lst/components/anmeldung/constant/validation";

/*
 * Types
 */

const dateTimeRangeSchema = z.object({
  start: z.object({
    day: daySchema,
    time: z.string(),
  }),
  end: z.object({
    day: daySchema,
    time: z.string(),
  }),
});

const publicProgramEntryRawSchema = z.object({
  uuid: z.string(),
  title: z.string(),
  organizer: z.string(),
  dateTimeRange: dateTimeRangeSchema,
  shortDescription: z.string(),
  longDescription: z.string(),
  participating: z.union([
    z.object({ kind: z.literal("NONE"), maxSeats: z.number() }),
    z.object({
      kind: z.literal("LIMITED"),
      maxSeats: z.number(),
      reserved: z.array(z.string()),
    }),
  ]),
  tagNames: z.string(),
  materialLanguage: z.string(),
  links: z.array(z.object({ label: z.string(), link: z.string() })),
});
export type PublicProgramEntryRaw = z.infer<typeof publicProgramEntryRawSchema>;
export type PublicProgramEntry = Omit<
  PublicProgramEntryRaw,
  "dateTimeRange"
> & {
  slot: {
    day: Temporal.PlainDate;
    start: Temporal.PlainTime;
    end: Temporal.PlainTime;
  };
};

const reservationsSchema = z.record(z.string(), z.number());
export type Reservations = z.infer<typeof reservationsSchema>;

const publicRawSchema = z.object({
  programEntries: z.array(publicProgramEntryRawSchema),
  reservations: reservationsSchema,
});

export type Public = {
  programEntries: PublicProgramEntry[];
  reservations: z.infer<typeof reservationsSchema>;
};

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

  const parseResult = publicRawSchema.safeParse(program.data);

  if (!parseResult.success) {
    console.error(parseResult.error);
    return {
      kind: "FAILURE",
    };
  }

  return {
    kind: "SUCCESS",
    data: {
      programEntries: parseResult.data.programEntries
        .map(toPublic)
        .filter((entry) => entry !== null),
      reservations: parseResult.data.reservations,
    },
  };
}

export function toPublic(
  entry: PublicProgramEntryRaw,
): PublicProgramEntry | null {
  const {
    dateTimeRange: { start, end },
  } = entry;

  const day = defaultPlainDates[start.day];
  const parsedStartTime = parsePlainTime(start.time);
  const parsedEndTime = parsePlainTime(end.time);

  if (parsedStartTime.kind === "ERROR" || parsedEndTime.kind === "ERROR") {
    return null;
  }

  const transformedEntry = {
    ...entry,
    slot: {
      day,
      start: parsedStartTime.value,
      end: parsedEndTime.value,
    },
  } satisfies PublicProgramEntry;

  const errors = getErrors({
    ...transformedEntry,
    timeSlots: [
      {
        uuid: entry.uuid,
        start,
        end,
      },
    ],
  });

  if (errors.hasErrors) {
    return null;
  }

  return transformedEntry;
}
