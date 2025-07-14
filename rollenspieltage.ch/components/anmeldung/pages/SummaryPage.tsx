import { Box } from "@common/components/Box";
import {
  Button,
  ButtonWithIcon,
  IconOnlyButton,
} from "@common/components/Button";
import { Chip } from "@common/components/Chip";
import {
  Dialog,
  type DialogStore,
  initDialogStore,
} from "@common/components/Dialog";
import type { IconType } from "@common/components/Icon";
import { initTextInput } from "@rst/components/anmeldung/api/form";
import type { ProgramEntryClient } from "@rst/components/anmeldung/api/program";
import type {
  ContactClient,
  SaveClient,
} from "@rst/components/anmeldung/api/save";
import type { PublishState } from "@rst/components/anmeldung/api/shared";
import type { Result } from "@rst/components/anmeldung/api/utils";
import {
  type ProgramEntryTimetableView,
  WeekendTimetable,
} from "@rst/components/anmeldung/components/Timetable";
import { TXT } from "@rst/components/anmeldung/constant/texts";
import { TextInputField } from "@rst/components/anmeldung/forms/Components";
import type { ChangePageFn } from "@rst/components/anmeldung/Router";
import type {
  DateTimeWindow,
  PerDay,
  TimeRange,
} from "@rst/components/anmeldung/utils/time";
import { createMemo, type JSX, type Resource, Show } from "solid-js";
import { createStore, type Store } from "solid-js/store";

export function SummaryPage(props: {
  store: Store<SaveClient>;
  program: Resource<Result<ProgramEntryClient[]>>;
  isEditable: boolean;
  changePage: ChangePageFn;
}): JSX.Element {
  const masterEntries = props.store.master.games.flatMap((game) =>
    game.slots.map((slot) => ({
      status: game.kind,
      uuid: game.uuid,
      title: game.title.value,
      dateTime: slot,
    })),
  );

  const program = () => {
    const p = props.program();
    if (p?.kind === "SUCCESS") {
      return p.data;
    }
    return [];
  };

  const reservationUuids = () => {
    const uuids = props.store.playing.reservations.map((r) => r.gameRound);
    return new Set(uuids);
  };

  const playEntries = () =>
    program()
      .filter((p) => reservationUuids().has(p.uuid))
      .map((p) => ({
        uuid: p.uuid,
        title: p.title,
        dateTime: p.slot,
      }));

  return (
    <>
      <Contact store={props.store.init} isEditable={props.isEditable} />
      <br />
      <Timeview
        entries={{
          play: playEntries(),
          master: masterEntries,
          help: [],
        }}
        changePage={props.changePage}
        isEditable={props.isEditable}
      />
    </>
  );
}

function Contact(props: {
  store: Store<ContactClient>;
  isEditable: boolean;
}): JSX.Element {
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
  entries: EntriesForAggregation;
  changePage: ChangePageFn;
  isEditable: boolean;
}): JSX.Element {
  const programEntries = aggregateEntries(
    props.entries,
    props.changePage,
    props.isEditable,
  );

  return (
    <>
      <h3>Mein Programm</h3>
      <br />
      <WeekendTimetable programEntries={programEntries} />
    </>
  );
}

type TimeviewKind = "master-draft" | "master" | "play" | "help";

function TimeviewEntry(props: {
  title: string;
  range: TimeRange;
  kind: TimeviewKind;
  onClick?: () => void;
}): JSX.Element {
  const duration = props.range.to - props.range.from;
  const labels = (
    {
      "master-draft": {
        label: "SL",
        help: "Spielleitung",
        link: {
          icon: "pencil",
          label: "Spielrunde bearbeiten",
        },
      },
      master: {
        label: "SL",
        help: "Spielleitung",
        link: {
          icon: "pencil",
          label: "Spielrunde bearbeiten",
        },
      },
      play: {
        label: "TN",
        help: "Teilnehmer:in",
        link: {
          icon: "link",
          label: "Zur Spielrunde",
        },
      },
      help: {
        label: "HL",
        help: "Helfen",
        link: {
          icon: "link",
          label: "",
        },
      },
    } satisfies Record<
      TimeviewKind,
      {
        label: string;
        help: string;
        link: {
          icon: IconType;
          label: string;
        };
      }
    >
  )[props.kind];

  const classes = () => {
    const cls = ["timeview-entry", "box-simple"];

    if (props.kind === "master-draft") {
      cls.push("gray");
    }

    if (props.kind === "master") {
      cls.push("special");
    }

    if (props.kind === "play") {
      cls.push("danger");
    }

    return cls.join(" ");
  };

  return (
    <div class={classes()}>
      <Chip title={labels.help} inverted={true} size="small">
        {labels.label}
      </Chip>
      <Show when={props.onClick}>
        {(onClick) => (
          <IconOnlyButton
            icon={labels.link.icon}
            kind="ghost"
            onClick={onClick()}
            title={labels.link.label}
          />
        )}
      </Show>
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

type EntriesForAggregation = {
  master: {
    status: PublishState;
    uuid: string;
    title: string;
    dateTime: DateTimeWindow;
  }[];
  play: {
    uuid: string;
    title: string;
    dateTime: DateTimeWindow;
  }[];
  help: {
    title: string;
    dateTime: DateTimeWindow;
  }[];
};

function aggregateEntries(
  entries: EntriesForAggregation,
  changePage: ChangePageFn,
  isEditable: boolean,
): PerDay<ProgramEntryTimetableView[]> {
  const aggregation: PerDay<ProgramEntryTimetableView[]> = {
    SATURDAY: [],
    SUNDAY: [],
  };

  if (!isEditable) {
    return aggregation;
  }

  entries.play.forEach((entry) => {
    aggregation[entry.dateTime.day].push({
      range: entry.dateTime,
      component: () => (
        <TimeviewEntry
          title={entry.title}
          range={entry.dateTime}
          kind="play"
          onClick={() =>
            changePage({
              kind: "GAME",
              uuid: entry.uuid,
            })
          }
        />
      ),
    });
  });

  entries.master.forEach((entry) => {
    if (entry.status === "archived") {
      return;
    }

    const titleBuffer = [entry.title];
    if (entry.status === "draft") {
      titleBuffer.unshift("(noch nicht veröffentlicht)");
    }

    aggregation[entry.dateTime.day].push({
      range: entry.dateTime,
      component: () => (
        <TimeviewEntry
          title={titleBuffer.join(" ")}
          range={entry.dateTime}
          kind={entry.status === "published" ? "master" : "master-draft"}
          onClick={() =>
            changePage({
              kind: "EDIT_GAMEROUND",
              uuid: entry.uuid,
            })
          }
        />
      ),
    });
  });

  entries.help.forEach((entry) => {
    aggregation[entry.dateTime.day].push({
      range: entry.dateTime,
      component: () => (
        <TimeviewEntry title={entry.title} range={entry.dateTime} kind="help" />
      ),
    });
  });

  return aggregation;
}
