import { defineFormView, record } from "@registration/state/codec";
import {
  DateField,
  DateTimeField,
  TimeField,
  VersionField,
} from "@registration/state/Fields";

export const SaveForm = defineFormView(
  record({
    version: VersionField(1),
    test: record({
      date: DateField(),
      time: TimeField(),
      dateTime: DateTimeField(),
    }),
  }),
);
