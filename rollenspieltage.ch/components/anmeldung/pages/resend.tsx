import { Box } from "@common/components/Box";
import { Button } from "@common/components/Button";
import { TextInputField } from "@common/components/newForm/Input";
import { elysium } from "@common/components/utils";
import { createReactive, obj } from "@common/utils/reactivity";
import { TXT } from "@common/utils/texts";
import { Show, type JSX } from "solid-js";

export function Resend(): JSX.Element {
  const store$ = createReactive<{
    email: string;
    state: "IDLE" | "LOADING" | "ERROR" | "SENT";
  }>({
    email: "",
    state: "IDLE",
  });

  async function onSubmit(e: SubmitEvent): Promise<void> {
    e.preventDefault();
    store$.pipe(obj.sub("state")).set("LOADING");
    try {
      const response = await fetch(elysium("/rst26/resend"), {
        method: "POST",
        body: JSON.stringify({ email: store$.get().email }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        store$.pipe(obj.sub("state")).set("SENT");
      } else {
        store$.pipe(obj.sub("state")).set("ERROR");
      }
    } catch (e) {
      console.error(e);
      store$.pipe(obj.sub("state")).set("ERROR");
    }
  }

  return (
    <>
      <form onSubmit={onSubmit} novalidate>
        <TextInputField
          label="E-Mail"
          name="email"
          type="email"
          value$={store$.pipe(obj.sub("email"))}
          disabled={store$.get().state !== "IDLE"}
        />
        <Button
          type="submit"
          kind={store$.get().state === "IDLE" ? "success" : "gray"}
          label={
            store$.get().state === "IDLE"
              ? "E-Mail erneut senden"
              : store$.get().state === "LOADING"
                ? "E-Mail wird erneut gesendet"
                : store$.get().state === "SENT"
                  ? "E-Mail wurde erneut gesendet"
                  : "E-Mail konnte nicht gesendet werden"
          }
          disabled={store$.get().state !== "IDLE"}
        />
        <Show when={store$.get().state === "ERROR"}>
          <Box type="danger">{TXT.error.ourMistake}</Box>
        </Show>
        <Show when={store$.get().state === "SENT"}>
          <Box type="success">
            Falls mit dieser E-Mail-Adresse eine Anmeldung gestartet wurde,{" "}
            <strong>
              haben wir dir soeben erneut den Anmeldelink gesendet.{" "}
            </strong>
            Solltest du keinen erhalten haben, dann kontaktiere uns bitte über
            das <a href="/kontakt">Kontaktformular</a> oder unseren{" "}
            <a href="/chat">Chat</a>.
          </Box>
        </Show>
      </form>
    </>
  );
}
