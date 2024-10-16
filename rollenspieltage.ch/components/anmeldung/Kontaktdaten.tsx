import type {
  SaveFromServer,
  UpdateSave,
} from "@rst/components/anmeldung/data";
import { Input, InputWithRef } from "@common/components/Input";
import { Show, type JSX } from "solid-js";
import { Box } from "@common/components/Box";

export function Kontaktdaten(props: {
  save: SaveFromServer;
  updateSave: UpdateSave;
}): JSX.Element {
  let emailField!: HTMLInputElement;
  return (
    <>
      <h2>Kontaktdaten</h2>
      <div class="content">
        <small>
          Deine persönlichen Daten werden ausschliesslich verwendet, um dich
          über das Programm der Luzerner Rollenspieltage 2024 zu informieren.
          Nach dem Event werden diese gelöscht.
        </small>
      </div>
      <br />
      <Input
        label="Name"
        name="name"
        value={props.save.name}
        onValueUpdate={(newValue) => props.updateSave("name", newValue)}
      />
      <Show when={props.save.name.trim().length === 0}>
        <div style="margin-block: .5rem;">
          <Box type="danger">Dies ist ein Pflichtfeld.</Box>
        </div>
      </Show>
      <br />
      <InputWithRef
        label="E-Mail"
        name="email"
        type="email"
        value={props.save.email}
        onValueUpdate={(newValue) => props.updateSave("email", newValue)}
        ref={emailField}
      />
      <Show when={props.save.email.trim().length === 0}>
        <div style="margin-block: .5rem;">
          <Box type="danger">Dies ist ein Pflichtfeld.</Box>
        </div>
      </Show>
      <Show
        when={props.save.email.length > 0 && emailField.validity.typeMismatch}
      >
        <div style="margin-block: .5rem;">
          <Box type="danger">
            Die Eingabe scheint keine gültige E-Mail-Adresse zu sein.
          </Box>
        </div>
      </Show>
      <br />
      <Input
        label="Handynummer"
        name="tel"
        type="tel"
        value={props.save.handynummer}
        required={false}
        onValueUpdate={(newValue) => props.updateSave("handynummer", newValue)}
      />
    </>
  );
}
