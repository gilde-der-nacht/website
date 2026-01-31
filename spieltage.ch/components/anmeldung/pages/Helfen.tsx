import { createResource, Show, Suspense, type JSX } from "solid-js";
import { Icon } from "@common/components/Icon";
import type { PerDay } from "@common/utils/time";
import {
  WeekendTimetable,
  type ProgramEntryTimetableView,
} from "@common/components/Timetable";
import {
  helpTimes,
  helpTypes,
  openingHoursHelping,
  type HelpTimes,
} from "@lst/components/anmeldung/constant/helping";
import { IconOnlyButton } from "@common/components/Button";
import { Chip } from "@common/components/Chip";
import { useNavigate, useSearchParams } from "@solidjs/router";
import type {
  HelpingReservation,
  Save,
} from "@lst/components/anmeldung/api/save";
import { type Store } from "solid-js/store";
import { Box } from "@common/components/Box";
import { TXT } from "@common/utils/texts";
import { loadHelp } from "@lst/components/anmeldung/api/help";

export function Helfen(props: {
  store: Store<Save>;
  isEditable: boolean;
  link: (path: string) => string;
}): JSX.Element {
  const [searchParams] = useSearchParams();

  const [helpResource] = createResource(() =>
    loadHelp(String(searchParams["secret"])),
  );

  return (
    <>
      <p>
        Beim Kiosk und der Essensausgabe können wir immer ein paar helfende
        Hände gebrauchen. Wenn du bereit bist zu helfen, klicke in der
        jeweiligen Stunde auf das Handsymbol <Icon icon="hand-heart" />.
      </p>
      <br />
      <Suspense fallback={<Box>{TXT.loading.program}</Box>}>
        <Show
          when={helpResource()}
          fallback={<Box type="danger">{TXT.error.help}</Box>}
        >
          {(help) => (
            <Show
              when={help().kind === "SUCCESS"}
              fallback={
                <Box type="danger">
                  <p>Plan konnte nicht geladen werden.</p>
                </Box>
              }
            >
              <HelpingContent
                helpReservations={props.store.helping}
                externalHelpReservations={(help() as { data: string[] }).data}
                isEditable={props.isEditable}
                link={props.link}
              />
            </Show>
          )}
        </Show>
      </Suspense>
    </>
  );
}

function HelpingContent(props: {
  helpReservations: HelpingReservation[];
  externalHelpReservations: string[];
  isEditable: boolean;
  link: (path: string) => string;
}): JSX.Element {
  const alreadyReservedUuids = (): string[] => {
    const already: string[] = [];
    props.helpReservations.forEach((r) => {
      already.push(r.helpEntryUuid);
    });
    props.externalHelpReservations.forEach((r) => {
      already.push(r);
    });

    return already;
  };

  const entries = () =>
    ({
      FRIDAY: aggregateEntries({
        constants: helpTimes.FRIDAY,
        alreadyReservedUuids: alreadyReservedUuids(),
        myReservations: props.helpReservations,
        link: props.link,
      }),
      SATURDAY: aggregateEntries({
        constants: helpTimes.SATURDAY,
        alreadyReservedUuids: alreadyReservedUuids(),
        myReservations: props.helpReservations,
        link: props.link,
      }),
      SUNDAY: aggregateEntries({
        constants: helpTimes.SUNDAY,
        alreadyReservedUuids: alreadyReservedUuids(),
        myReservations: props.helpReservations,
        link: props.link,
      }),
    }) satisfies PerDay<ProgramEntryTimetableView[]>;

  return (
    <WeekendTimetable
      programEntries={entries()}
      openingHours={openingHoursHelping}
      conflictsAllowed={true}
      columns={4}
    />
  );
}

function aggregateEntries(props: {
  constants: HelpTimes;
  alreadyReservedUuids: string[];
  myReservations: HelpingReservation[];
  link: (path: string) => string;
}): ProgramEntryTimetableView[] {
  const navigate = useNavigate();
  const entries: ProgramEntryTimetableView[] = [];
  const frequencies = uuidFrequencies(props.alreadyReservedUuids);

  Object.entries(props.constants).forEach(([hour, slots]) => {
    slots.forEach((slot) => {
      const range = {
        from: Number(hour),
        to: Number(hour) + slot.duration,
      };

      const emptySeats = () => slot.count - (frequencies[slot.uuid] ?? 0);
      const helpingMyself = () =>
        props.myReservations.filter((r) => r.helpEntryUuid === slot.uuid)
          .length > 0;

      const classes = () => {
        const cls = ["box-simple", "timeview-entry"];
        if (helpingMyself()) {
          cls.push("success");
        }
        return cls.join(" ");
      };

      if (emptySeats() === 0) {
        entries.push({
          range,
          component: () => (
            <div
              class={classes()}
              onClick={() => navigate(props.link(`/helfen/${slot.uuid}`))}
            >
              <Chip
                title="Helfer:innen gesucht"
                inverted={helpingMyself()}
                size="small"
              >
                HL
              </Chip>
              <Show when={helpingMyself()}>
                <IconOnlyButton
                  icon="hand-heart"
                  kind="ghost"
                  onClick={() => navigate(props.link(`/helfen/${slot.uuid}`))}
                  title="Helfen"
                />
              </Show>
              <h5 title={helpTypes[slot.kind].title}>
                {helpTypes[slot.kind].title}
              </h5>
              <p class="duration">
                <em>
                  {emptySeats()} / {slot.count}
                </em>
              </p>
            </div>
          ),
        });
      } else {
        entries.push({
          range,
          component: () => (
            <div
              class={classes()}
              onClick={() => navigate(props.link(`/helfen/${slot.uuid}`))}
            >
              <Chip
                title="Helfer:innen gesucht"
                inverted={helpingMyself()}
                size="small"
              >
                HL
              </Chip>
              <IconOnlyButton
                icon="hand-heart"
                kind="ghost"
                onClick={() => navigate(props.link(`/helfen/${slot.uuid}`))}
                title="Helfen"
              />
              <h5 title={helpTypes[slot.kind].title}>
                {helpTypes[slot.kind].title}
              </h5>
              <p class="duration">
                <em>
                  {slot.count - emptySeats()} / {slot.count}
                </em>
              </p>
            </div>
          ),
        });
      }
    });
  });
  return entries;
}

function uuidFrequencies(uuids: string[]): Record<string, number> {
  const grouped = Object.groupBy(uuids, (id) => id);
  const frequencies: Record<string, number> = {};
  for (const uuid of uuids) {
    frequencies[uuid] = grouped[uuid]?.length ?? 0;
  }
  return frequencies;
}
