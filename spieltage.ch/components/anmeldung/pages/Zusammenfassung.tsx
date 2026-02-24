import { createMemo, Show, Suspense, type JSX, type Resource } from "solid-js";
import { createStore, type Store } from "solid-js/store";
import { Box } from "@common/components/Box";
import {
  Dialog,
  initDialogStore,
  type DialogStore,
} from "@common/components/Dialog";
import { Button, ButtonWithIcon } from "@common/components/Button";
import { TextInputField } from "@common/components/Components";
import { TXT } from "@common/utils/texts";
import { initTextInput } from "@common/components/form";
import type { Contact, Save } from "@lst/components/anmeldung/api/save";
import { elysium } from "@common/components/utils";
import { z } from "astro/zod";
import { useSearchParams } from "@solidjs/router";
import type { Result } from "@lst/components/anmeldung/api/elysium";
import type { Public } from "@lst/components/anmeldung/api/public";
import { Timeview } from "@lst/components/anmeldung/components/Timeview";
import { obj, type Reactive } from "@common/utils/reactivity";
import { Checkbox } from "@common/components/newForm/Checkbox";

export function Zusammenfassung(props: {
  save$: Reactive<Save>;
  publicResource: Resource<Result<Public>>;
  link: (path: string) => string;
  isEditable: boolean;
}): JSX.Element {
  return (
    <div style="display: grid; gap: 1rem;">
      <Contact
        contact$={props.save$.pipe(obj.sub("contact"))}
        isEditable={props.isEditable}
      />
      <Checkbox
        label="Schickt mir bitte E-Mails, wenn neue Programmpunkte veröffentlicht werden."
        checked$={props.save$
          .pipe(obj.sub("config"))
          .pipe(obj.sub("wantsUpdates"))}
        name="wantsUpdates"
        value="wantsUpdates"
      />

      <Suspense fallback={<Box>{TXT.loading.program}</Box>}>
        <Show
          when={props.publicResource()}
          fallback={<Box type="danger">{TXT.error.help}</Box>}
        >
          {(publicData) => (
            <Show
              when={publicData().kind === "SUCCESS"}
              fallback={<Box type="danger">{TXT.error.program}</Box>}
            >
              <Timeview
                save={props.save$.get()}
                publicState={(publicData() as { data: Public }).data}
                link={props.link}
              />
            </Show>
          )}
        </Show>
      </Suspense>
    </div>
  );
}

function Contact(props: {
  contact$: Reactive<Contact>;
  isEditable: boolean;
}): JSX.Element {
  const [dialogStore, setDialogStore] = createStore(initDialogStore());
  const { name, email, mobile } = props.contact$.get();

  return (
    <Box>
      {
        // Show not really necesary, but I have some bug where the contact edit dialog does not get reset when closed. This is the hacky, fast solution for now.
      }
      <Show when={dialogStore.open}>
        <ContactEditDialog
          contact$={props.contact$}
          dialogStore={dialogStore}
        />
      </Show>
      <div style="display: grid; gap: 1rem;">
        <h3>Meine Kontaktdaten</h3>
        <p>
          <strong>Name:</strong> {name}
        </p>
        <p>
          <strong>E-Mail:</strong> {email}
        </p>
        <p>
          <strong>Handynummer:</strong> {mobile}
        </p>

        <Show when={props.isEditable}>
          <div>
            <ButtonWithIcon
              icon="pencil"
              label="Kontaktdaten editieren"
              onClick={() => setDialogStore("open", true)}
            />
          </div>
        </Show>
      </div>
    </Box>
  );
}

type EmailDuplicateStore =
  | {
      kind: "CHECKING";
    }
  | {
      kind: "IDLE";
      isDuplicate: boolean;
    };

function ContactEditDialog(props: {
  contact$: Reactive<Contact>;
  dialogStore: Store<DialogStore>;
}): JSX.Element {
  const [searchParams] = useSearchParams();

  const [formStore] = createStore({
    name: initTextInput(props.contact$.get().name),
    email: initTextInput(props.contact$.get().email),
    mobile: initTextInput(props.contact$.get().mobile),
  });

  const [emailIsDuplicate, setEmailIsDuplicate] =
    createStore<EmailDuplicateStore>({
      kind: "IDLE",
      isDuplicate: false,
    });

  const errors = createMemo(() => {
    const err: { name: string[]; email: string[] } = {
      name: [],
      email: [],
    };

    if (formStore.name.value.trim().length === 0) {
      err.name.push(TXT.mandatoryField);
    }

    if (formStore.email.value.trim().length === 0) {
      err.email.push(TXT.mandatoryField);
    } else if (!formStore.email.value.includes("@")) {
      err.email.push(TXT.invalidEmail);
    }

    if (emailIsDuplicate.kind === "IDLE" && emailIsDuplicate.isDuplicate) {
      err.email.push("Diese E-Mail wird bereits verwendet.");
    }

    return { ...err, hasErrors: err.name.length + err.email.length > 0 };
  });

  const [_, setDialogStore] = createStore(props.dialogStore);

  return (
    <Dialog
      store={props.dialogStore}
      title="Kontaktdaten editieren"
      onClose={() => {}}
      size="medium"
    >
      <form novalidate>
        <TextInputField
          store={formStore.name}
          label="Name"
          name="name"
          showErrors="ON_BLUR"
          errors={errors().name}
        />
        <TextInputField
          store={formStore.email}
          label="E-Mail"
          name="email"
          showErrors="ALWAYS"
          errors={errors().email}
          onUpdate={() =>
            setEmailIsDuplicate({ kind: "IDLE", isDuplicate: false })
          }
        />
        <TextInputField
          store={formStore.mobile}
          label="Handynummer"
          name="mobile"
        />
        <Button
          label="Speichern"
          disabled={errors().hasErrors || emailIsDuplicate.kind === "CHECKING"}
          onClick={async () => {
            if (!errors().hasErrors) {
              setEmailIsDuplicate({ kind: "CHECKING" });

              const secret = searchParams["secret"];
              const result = await fetch(
                elysium(
                  `/lst26/check-email?email=${formStore.email.value}&secret=${secret}`,
                ),
              );

              if (!result.ok) {
                setEmailIsDuplicate({ kind: "IDLE", isDuplicate: true });
                return;
              }

              const data = (await result.json()) as unknown;
              const parsed = checkEmailDuplicateSchema.safeParse(data);
              if (!parsed.success) {
                setEmailIsDuplicate({ kind: "IDLE", isDuplicate: true });
                return;
              }

              if (parsed.data.kind === "FAILURE") {
                setEmailIsDuplicate({ kind: "IDLE", isDuplicate: true });
                return;
              }

              setEmailIsDuplicate({ kind: "IDLE", isDuplicate: false });

              props.contact$.set({
                name: formStore.name.value,
                email: formStore.email.value,
                mobile: formStore.mobile.value,
              });

              setDialogStore("open", false);
            }
          }}
        />
      </form>
    </Dialog>
  );
}

const checkEmailDuplicateSchema = z.union([
  z.object({ kind: z.literal("SUCCESS") }),
  z.object({ kind: z.literal("FAILURE") }),
]);
