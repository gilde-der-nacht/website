import { createMemo, Show, type JSX } from "solid-js";
import { createStore, type Store } from "solid-js/store";
import type {
  ContactClient,
  SaveClient,
} from "@rst/components/anmeldung/api/save";
import { Button, ButtonWithIcon } from "@common/components/Button";
import {
  Dialog,
  initDialogStore,
  type DialogStore,
} from "@common/components/Dialog";
import { TextInputField } from "@rst/components/anmeldung/forms/Components";
import { TXT } from "@rst/components/anmeldung/constant/texts";
import { initTextInput } from "@rst/components/anmeldung/api/form";
import {
  WeekendTimetable,
  type ProgramEntryTimetableView,
} from "@rst/components/anmeldung/components/Timetable";
import type {
  DateTimeWindow,
  PerDay,
  TimeRange,
} from "@rst/components/anmeldung/utils/time";
import { Box } from "@common/components/Box";
import { Chip } from "@common/components/Chip";

export function SummaryPage(props: { store: Store<SaveClient> }): JSX.Element {
  const masterEntries = props.store.master.games.flatMap((game) =>
    game.slots.map((slot) => ({
      dateTime: slot,
      title: game.title.value,
    })),
  );

  return (
    <>
      <Contact store={props.store.init} />
      <br />
      <Box type="danger">
        <p>
          Der folgende Abschnitt ist noch in Bearbeitung, wird demnächst
          verbessert und kann aktuell noch Fehler beinhalten.
        </p>
      </Box>
      <br />
      <Timeview
        playingEntries={[]}
        masterEntries={masterEntries}
        helpingEntries={[]}
      />
    </>
  );
}

function Contact(props: { store: Store<ContactClient> }): JSX.Element {
  const [_, setStore] = createStore(props.store);
  const [dialogStore, setDialogStore] = createStore(initDialogStore());

  return (
    <Box>
      {
        // Show not really necesary, but I have some bug where the contact edit dialog does not get reset when closed. This is the hacky, fast solution for now.
      }
      <Show when={dialogStore.open}>
        <ContactEditDialog
          dialogStore={dialogStore}
          currentState={props.store}
          updateCurrentState={setStore}
        />
      </Show>
      <div style="display: grid; gap: 1rem;">
        <h3>Meine Kontaktdaten</h3>
        <p>
          <strong>Name:</strong> {props.store.name}
        </p>
        <p>
          <strong>E-Mail:</strong> {props.store.email}
        </p>
        <p>
          <strong>Handynummer:</strong> {props.store.mobile}
        </p>

        <div>
          <ButtonWithIcon
            icon="pencil"
            label="Kontakdaten editieren"
            onClick={() => setDialogStore("open", true)}
          />
        </div>
      </div>
    </Box>
  );
}

function ContactEditDialog(props: {
  dialogStore: Store<DialogStore>;
  currentState: ContactClient;
  updateCurrentState: (newState: ContactClient) => void;
}): JSX.Element {
  const [formStore] = createStore({
    name: initTextInput(props.currentState.name),
    email: initTextInput(props.currentState.email),
    mobile: initTextInput(props.currentState.mobile),
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
          showErrors="ON_BLUR"
          errors={errors().email}
        />
        <TextInputField
          store={formStore.mobile}
          label="Handynummer"
          name="mobile"
        />
        <Button
          label="Speichern"
          disabled={errors().hasErrors}
          onClick={() => {
            if (!errors().hasErrors) {
              props.updateCurrentState({
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

function Timeview(props: {
  playingEntries: { dateTime: DateTimeWindow; title: string }[];
  masterEntries: { dateTime: DateTimeWindow; title: string }[];
  helpingEntries: { dateTime: DateTimeWindow; title: string }[];
}): JSX.Element {
  const programEntries = aggregateEntries(
    props.playingEntries,
    props.masterEntries,
    props.helpingEntries,
  );

  return (
    <>
      <h3>Mein Programm</h3>
      <br />
      <WeekendTimetable programEntries={programEntries} />
    </>
  );
}

function TimeviewEntry(props: {
  title: string;
  range: TimeRange;
  kind: "master" | "play" | "help";
}): JSX.Element {
  const duration = props.range.to - props.range.from;
  const labels = {
    master: {
      label: "SL",
      help: "Spielleitung",
    },
    play: {
      label: "TN",
      help: "Teilnehmer:in",
    },
    help: {
      label: "HL",
      help: "Helfen",
    },
  }[props.kind];

  return (
    <div class="timeview-entry box-simple special">
      <Chip title={labels.help} inverted={true} size="small">
        {labels.label}
      </Chip>
      <h5 title={props.title}>{props.title}</h5>
      <p class="duration">
        von {props.range.from} bis {props.range.to} Uhr{" "}
        <em>
          <small>
            ({duration} {duration === 1 ? "Stunde" : "Stunden"})
          </small>
        </em>
      </p>
    </div>
  );
}

function aggregateEntries(
  playingEntries: { dateTime: DateTimeWindow; title: string }[],
  masterEntries: { dateTime: DateTimeWindow; title: string }[],
  helpingEntries: { dateTime: DateTimeWindow; title: string }[],
): PerDay<ProgramEntryTimetableView[]> {
  const aggregation: PerDay<ProgramEntryTimetableView[]> = {
    SATURDAY: [],
    SUNDAY: [],
  };

  playingEntries.forEach((entry) => {
    aggregation[entry.dateTime.day].push({
      range: entry.dateTime,
      component: (
        <TimeviewEntry title={entry.title} range={entry.dateTime} kind="play" />
      ),
    });
  });

  masterEntries.forEach((entry) => {
    aggregation[entry.dateTime.day].push({
      range: entry.dateTime,
      component: (
        <TimeviewEntry
          title={entry.title}
          range={entry.dateTime}
          kind="master"
        />
      ),
    });
  });

  helpingEntries.forEach((entry) => {
    aggregation[entry.dateTime.day].push({
      range: entry.dateTime,
      component: (
        <TimeviewEntry title={entry.title} range={entry.dateTime} kind="help" />
      ),
    });
  });

  return aggregation;
}
