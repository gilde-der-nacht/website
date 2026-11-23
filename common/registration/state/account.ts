import { defineForm, list, record } from "@registration/state/codec";
import { LiteralField, StringField } from "@registration/state/Fields";

export const AccountForm = defineForm(
  record({
    name: StringField(),
    email: StringField(),
    mobile: StringField(),
    roles: list(LiteralField(["admin", "editor", "bear"])),
  }),
);
