import { Temporal } from "@js-temporal/polyfill";
import { z } from "astro/zod";
import { backendSchema } from "@registration/state/BackendState";
import { editableSchema } from "@registration/state//Editable";

export const schemaCodec = z.codec(backendSchema, editableSchema, {
  decode: (backend) => ({
    title: backend.title,
    ts: plainDateTimeToString.decode(backend.ts),
  }),
  encode: (editable) => ({
    title: editable.title,
    ts: plainDateTimeToString.encode(editable.ts),
  }),
});

const plainDateTimeToString = z.codec(
  z.instanceof(Temporal.PlainDateTime),
  z.string(),
  {
    decode: (dateTime) => {
      function padNumber(num: number, length: number = 2): string {
        return num.toString().padStart(length, "0");
      }
      const day = padNumber(dateTime.day);
      const month = padNumber(dateTime.month);
      const year = padNumber(dateTime.year, 4);

      const hour = padNumber(dateTime.hour);
      const minute = padNumber(dateTime.minute);

      return `${day}.${month}.${year} ${hour}:${minute}`;
    },
    encode: (str) => {
      const [date, time] = str.split(" ");
      const [day, month, year] = (date ?? "").split(".");
      const [hour, minute] = (time ?? "").split(".");
      return Temporal.PlainDateTime.from({
        day: Number.parseInt(day ?? ""),
        month: Number.parseInt(month ?? ""),
        year: Number.parseInt(year ?? ""),
        hour: Number.parseInt(hour ?? ""),
        minute: Number.parseInt(minute ?? ""),
      });
    },
  },
);
