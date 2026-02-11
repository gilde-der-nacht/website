import { z } from "astro/zod";
import { elysium } from "./utils";
import type { PlainDateOrTimeRange } from "@common/utils/time";
import { Temporal } from "@js-temporal/polyfill";

const locationSchema = z.object({
  label: z.string(),
  labelLong: z.nullable(z.string()),
  virtual: z.boolean(),
  url: z.nullable(z.string().url()),
  comment: z.nullable(z.string()),
});

const organizerSchema = z.object({
  name: z.string(),
  url: z.nullable(z.string()),
});

const eventDateTimeSchema = z
  .object({
    startDate: z.string(),
    endDate: z.string(),
  })
  .transform((val, ctx): PlainDateOrTimeRange => {
    const parsedStartDate = parsePlainDateOrTime(val.startDate);
    if (parsedStartDate.kind === "ERROR") {
      ctx.addIssue({
        code: "custom",
        message: parsedStartDate.message,
      });
    }
    const parsedEndDate = parsePlainDateOrTime(val.endDate);
    if (parsedEndDate.kind === "ERROR") {
      ctx.addIssue({
        code: "custom",
        message: parsedEndDate.message,
      });
    }

    if (parsedStartDate.kind === "ERROR" || parsedEndDate.kind === "ERROR") {
      return z.NEVER;
    }

    if (parsedStartDate.kind === "DATE" && parsedEndDate.kind === "DATE") {
      return {
        startDate: parsedStartDate.value,
        endDate: parsedEndDate.value,
      };
    } else if (
      parsedStartDate.kind === "DATETIME" &&
      parsedEndDate.kind === "DATETIME"
    ) {
      return {
        startDate: parsedStartDate.value,
        endDate: parsedEndDate.value,
      };
    }

    ctx.addIssue({
      code: "custom",
      message: `Both dates must be either of type PlainDate or PlainDateTime but not mixed. "startDate": '${val.startDate}'; "endDate": '${val.endDate}'`,
    });

    return z.NEVER;
  });

export type EventDateTime = z.infer<typeof eventDateTimeSchema>;

type EventTemporal =
  | {
      startDate: Temporal.PlainDate;
      endDate: Temporal.PlainDate;
    }
  | {
      startDate: Temporal.PlainDateTime;
      endDate: Temporal.PlainDateTime;
    };

export function toTemporal(eventDateTime: EventDateTime): EventTemporal {
  const { startDate, endDate } = eventDateTime;
  if ("hour" in startDate && "hour" in endDate) {
    return {
      startDate: Temporal.PlainDateTime.from({
        year: startDate.year,
        month: startDate.month,
        day: startDate.day,
        hour: startDate.hour,
        minute: startDate.minute,
      }),
      endDate: Temporal.PlainDateTime.from({
        year: endDate.year,
        month: endDate.month,
        day: endDate.day,
        hour: endDate.hour,
        minute: endDate.minute,
      }),
    };
  }
  return {
    startDate: Temporal.PlainDate.from({
      year: startDate.year,
      month: startDate.month,
      day: startDate.day,
    }),
    endDate: Temporal.PlainDate.from({
      year: endDate.year,
      month: endDate.month,
      day: endDate.day,
    }),
  };
}

export type PlainDateOrTimeParseResult =
  | {
      kind: "ERROR";
      message: string;
    }
  | {
      kind: "DATE";
      value: Temporal.PlainDate;
    }
  | {
      kind: "DATETIME";
      value: Temporal.PlainDateTime;
    };

export function parsePlainDateOrTime(
  input: string,
): PlainDateOrTimeParseResult {
  const [date, time] = input.split("T");
  if (date === undefined) {
    return { kind: "ERROR", message: "Empty string" };
  }
  const [yearStr, monthStr, dayStr] = date.split("-");

  if (yearStr === undefined || yearStr.length !== 4) {
    return {
      kind: "ERROR",
      message: `Invalid year '${yearStr}' in '${input}'`,
    };
  }

  if (monthStr === undefined || monthStr.length !== 2) {
    return {
      kind: "ERROR",
      message: `Invalid month '${monthStr}' in '${input}'`,
    };
  }

  if (dayStr === undefined || dayStr.length !== 2) {
    return { kind: "ERROR", message: `Invalid day '${dayStr}' in '${input}'` };
  }

  const [year, month, day] = [
    Number.parseInt(yearStr),
    Number.parseInt(monthStr),
    Number.parseInt(dayStr),
  ];

  if (time === undefined) {
    return {
      kind: "DATE",
      value: Temporal.PlainDate.from({
        year,
        month,
        day,
      }),
    };
  }

  const [hourStr, minuteStr, _secondStr] = time.split(":");
  if (hourStr === undefined || hourStr.length !== 2) {
    return {
      kind: "ERROR",
      message: `Invalid hour '${hourStr}' in '${input}'`,
    };
  }

  if (minuteStr === undefined || minuteStr.length !== 2) {
    return {
      kind: "ERROR",
      message: `Invalid minute '${minuteStr}' in '${input}'`,
    };
  }

  const [hour, minute] = [Number.parseInt(hourStr), Number.parseInt(minuteStr)];

  return {
    kind: "DATETIME",
    value: Temporal.PlainDateTime.from({
      year,
      month,
      day,
      hour,
      minute,
    }),
  };
}

export type PlainDateTimeParseResult =
  | {
      kind: "ERROR";
      message: string;
    }
  | {
      kind: "DATETIME";
      value: Temporal.PlainDateTime;
    };

export function parsePlainDateTime(input: string): PlainDateTimeParseResult {
  const [date, time] = input.split("T");
  if (date === undefined) {
    return { kind: "ERROR", message: "Empty string" };
  }
  if (time === undefined) {
    return { kind: "ERROR", message: "Missing time" };
  }

  const [yearStr, monthStr, dayStr] = date.split("-");

  if (yearStr === undefined || yearStr.length !== 4) {
    return {
      kind: "ERROR",
      message: `Invalid year '${yearStr}' in '${input}'`,
    };
  }

  if (monthStr === undefined || monthStr.length !== 2) {
    return {
      kind: "ERROR",
      message: `Invalid month '${monthStr}' in '${input}'`,
    };
  }

  if (dayStr === undefined || dayStr.length !== 2) {
    return { kind: "ERROR", message: `Invalid day '${dayStr}' in '${input}'` };
  }

  const [year, month, day] = [
    Number.parseInt(yearStr),
    Number.parseInt(monthStr),
    Number.parseInt(dayStr),
  ];

  const [hourStr, minuteStr, _secondStr] = time.split(":");
  if (hourStr === undefined || hourStr.length !== 2) {
    return {
      kind: "ERROR",
      message: `Invalid hour '${hourStr}' in '${input}'`,
    };
  }

  if (minuteStr === undefined || minuteStr.length !== 2) {
    return {
      kind: "ERROR",
      message: `Invalid minute '${minuteStr}' in '${input}'`,
    };
  }

  const [hour, minute] = [Number.parseInt(hourStr), Number.parseInt(minuteStr)];

  return {
    kind: "DATETIME",
    value: Temporal.PlainDateTime.from({
      year,
      month,
      day,
      hour,
      minute,
    }),
  };
}

export type PlainDateParseResult =
  | {
      kind: "ERROR";
      message: string;
    }
  | {
      kind: "DATE";
      value: Temporal.PlainDate;
    };

export function parsePlainDate(input: string): PlainDateParseResult {
  const [yearStr, monthStr, dayStr, ...rest] = input.split("-");
  if (rest.length > 0) {
    return {
      kind: "ERROR",
      message: "Invalid date",
    };
  }

  if (yearStr === undefined || yearStr.length !== 4) {
    return {
      kind: "ERROR",
      message: `Invalid year '${yearStr}' in '${input}'`,
    };
  }

  if (monthStr === undefined || monthStr.length !== 2) {
    return {
      kind: "ERROR",
      message: `Invalid month '${monthStr}' in '${input}'`,
    };
  }

  if (dayStr === undefined || dayStr.length !== 2) {
    return { kind: "ERROR", message: `Invalid day '${dayStr}' in '${input}'` };
  }

  const [year, month, day] = [
    Number.parseInt(yearStr),
    Number.parseInt(monthStr),
    Number.parseInt(dayStr),
  ];

  return {
    kind: "DATE",
    value: Temporal.PlainDate.from({
      year,
      month,
      day,
    }),
  };
}

export type PlainTimeParseResult =
  | {
      kind: "ERROR";
      message: string;
    }
  | {
      kind: "TIME";
      value: Temporal.PlainTime;
    };

export function parsePlainTime(input: string): PlainTimeParseResult {
  const [hourStr, minuteStr, _secondStr] = input.split(":");
  if (hourStr === undefined || hourStr.length !== 2) {
    return {
      kind: "ERROR",
      message: `Invalid hour '${hourStr}' in '${input}'`,
    };
  }

  if (minuteStr === undefined || minuteStr.length !== 2) {
    return {
      kind: "ERROR",
      message: `Invalid minute '${minuteStr}' in '${input}'`,
    };
  }

  const [hour, minute] = [Number.parseInt(hourStr), Number.parseInt(minuteStr)];

  return {
    kind: "TIME",
    value: Temporal.PlainTime.from({
      hour,
      minute,
    }),
  };
}
const eventSchema = z.object({
  uuid: z.string().uuid(),
  title: z.string(),
  description: z.nullable(z.string()),
  tags: z.array(z.string()),
  links: z.array(z.object({ label: z.string(), url: z.string().url() })),
  type: z.string(),
  location: locationSchema,
  organizer: organizerSchema,
  date: eventDateTimeSchema,
});

export type OlympEvent = z.infer<typeof eventSchema>;

export async function loadPublishedEvents(): Promise<OlympEvent[]> {
  const response = await fetch(elysium("/calendar"));
  const json = (await response.json()) as unknown;

  return z.array(eventSchema).parse(json);
}
