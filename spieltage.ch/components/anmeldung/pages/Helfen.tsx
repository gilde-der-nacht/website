import {
  createSignal,
  Show,
  Suspense,
  type JSX,
  type Resource,
} from "solid-js";
import { Icon } from "@common/components/Icon";
import type { PerDay, PlainTimeDuration, ProgramDay } from "@common/utils/time";
import {
  WeekendTimetable,
  type ProgramEntryTimetableView,
} from "@common/components/Timetable";
import {
  helpTimes,
  helpTypes,
  openingHoursHelping,
  type HelpEntry,
} from "@lst/components/anmeldung/constant/helping";
import { IconOnlyButton } from "@common/components/Button";
import { Chip } from "@common/components/Chip";
import { A, useNavigate } from "@solidjs/router";
import type {
  HelpingReservation,
  Save,
} from "@lst/components/anmeldung/api/save";
import { type Store } from "solid-js/store";
import { Box } from "@common/components/Box";
import { TXT } from "@common/utils/texts";
import {
  type Public,
  type Reservations,
} from "@lst/components/anmeldung/api/public";
import type { Roles } from "@lst/components/anmeldung/api/meta";
import { Heading } from "@common/components/Heading";
import { BoxLink } from "@common/components/BoxLink";
import type { Result } from "@lst/components/anmeldung/api/elysium";
import { getDay } from "@lst/components/anmeldung/constant/time";
import { DayFilter, type DayFilterState } from "@common/components/Filter";

export function Helfen(props: {
  store: Store<Save>;
  publicResource: Resource<Result<Public>>;
  isEditable: boolean;
  link: (path: string) => string;
  roles: Roles;
}): JSX.Element {
  const [dayFilter, setDayFilter] = createSignal<DayFilterState>(null);

  return (
    <>
      <p>
        Beim Kiosk und der Essensausgabe können wir immer ein paar helfende
        Hände gebrauchen. Wenn du bereit bist zu helfen, klicke in der
        jeweiligen Stunde auf das Handsymbol <Icon icon="hand-heart" />.
      </p>
      <br />
      <Heading level={3} title="Erklärbären" />
      <br />
      <div class="dynamic-columns">
        <p>
          Eines der Hauptziele der Luzerner Spieltage ist es, dass die
          Besucher/-innen noch nicht gespielte Spiele ausprobieren können. Dazu
          unterstützen uns jedes Jahr Freiwillige und erklären die ihnen
          bekannten Spiele aus der Spiele-Bibliothek. Diese Erklärbären sind
          durch ihr rotes T-Shirt erkennbar.
        </p>
        <A
          href={props.link("/erklaerbaer")}
          class="button-link"
          style="margin-block-end: 1rem; padding: 0;"
        >
          <BoxLink icon="forward" type="success">
            <h4>Zur Anmeldung für Erklärbären</h4>
          </BoxLink>
        </A>
      </div>

      <br />

      <DayFilter dayFilter={dayFilter} setDayFilter={setDayFilter} />

      <br />

      <Suspense fallback={<Box>{TXT.loading.program}</Box>}>
        <Show
          when={props.publicResource()}
          fallback={<Box type="danger">{TXT.error.help}</Box>}
        >
          {(publicData) => (
            <Show
              when={publicData().kind === "SUCCESS"}
              fallback={
                <Box type="danger">
                  <p>Plan konnte nicht geladen werden.</p>
                </Box>
              }
            >
              <HelpingContent
                myHelpReservations={props.store.helping}
                allReservations={
                  (publicData() as { data: Public }).data.reservations
                }
                isEditable={props.isEditable}
                link={props.link}
                dayFilter={dayFilter()}
              />
            </Show>
          )}
        </Show>
      </Suspense>
    </>
  );
}

function HelpingContent(props: {
  myHelpReservations: HelpingReservation[];
  allReservations: Reservations;
  isEditable: boolean;
  link: (path: string) => string;
  dayFilter: ProgramDay | null;
}): JSX.Element {
  const alreadyReservedUuids = (): string[] => {
    return Object.keys(props.allReservations);
  };

  const entries = () =>
    ({
      FRIDAY: aggregateEntries({
        day: "FRIDAY",
        entries: helpTimes,
        alreadyReservedUuids: alreadyReservedUuids(),
        myReservations: props.myHelpReservations,
        link: props.link,
      }),
      SATURDAY: aggregateEntries({
        day: "SATURDAY",
        entries: helpTimes,
        alreadyReservedUuids: alreadyReservedUuids(),
        myReservations: props.myHelpReservations,
        link: props.link,
      }),
      SUNDAY: aggregateEntries({
        day: "SUNDAY",
        entries: helpTimes,
        alreadyReservedUuids: alreadyReservedUuids(),
        myReservations: props.myHelpReservations,
        link: props.link,
      }),
    }) satisfies PerDay<ProgramEntryTimetableView[]>;

  return (
    <WeekendTimetable
      programEntries={entries()}
      openingHours={openingHoursHelping}
      conflictsAllowed={true}
      columns={4}
      dayFilter={props.dayFilter}
    />
  );
}

function aggregateEntries(props: {
  day: ProgramDay;
  entries: HelpEntry[];
  alreadyReservedUuids: string[];
  myReservations: HelpingReservation[];
  link: (path: string) => string;
}): ProgramEntryTimetableView[] {
  const navigate = useNavigate();
  const timetableView: ProgramEntryTimetableView[] = [];
  const frequencies = uuidFrequencies(props.alreadyReservedUuids);

  const byDay = Object.groupBy(
    props.entries,
    (entry) => getDay(entry.dateTime.startDate) ?? "empty",
  );

  byDay[props.day]?.forEach((entry) => {
    const emptySeats = () => entry.count - (frequencies[entry.uuid] ?? 0);
    const helpingMyself = () =>
      props.myReservations.filter(
        (r) => "helpEntryUuid" in r && r.helpEntryUuid === entry.uuid,
      ).length > 0;

    const classes = () => {
      const cls = ["box-simple", "timeview-entry"];
      if (helpingMyself()) {
        cls.push("success");
      }
      return cls.join(" ");
    };

    const range: PlainTimeDuration = {
      startTime: {
        hour: entry.dateTime.startDate.hour,
        minute: entry.dateTime.startDate.minute,
      },
      endTime:
        entry.dateTime.startDate.day !== entry.dateTime.endDate.day
          ? {
              hour: entry.dateTime.endDate.hour + 24, // Quick solution to handle midnight for now
              minute: entry.dateTime.endDate.minute,
            }
          : {
              hour: entry.dateTime.endDate.hour,
              minute: entry.dateTime.endDate.minute,
            },
    };

    if (emptySeats() === 0) {
      timetableView.push({
        range,
        component: () => (
          <div
            class={classes()}
            onClick={() => navigate(props.link(`/helfen/${entry.uuid}`))}
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
                onClick={() => navigate(props.link(`/helfen/${entry.uuid}`))}
                title="Helfen"
              />
            </Show>
            <h5 title={helpTypes[entry.kind].title}>
              {helpTypes[entry.kind].title}
            </h5>
            <p class="duration">
              <em>
                {emptySeats()} / {entry.count}
              </em>
            </p>
          </div>
        ),
      });
    } else {
      timetableView.push({
        range,
        component: () => (
          <div
            class={classes()}
            onClick={() => navigate(props.link(`/helfen/${entry.uuid}`))}
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
              onClick={() => navigate(props.link(`/helfen/${entry.uuid}`))}
              title="Helfen"
            />
            <h5 title={helpTypes[entry.kind].title}>
              {helpTypes[entry.kind].title}
            </h5>
            <p class="duration">
              <span>
                von
                {range.startTime.hour}&nbsp;bis {range.endTime.hour}
                &nbsp;Uhr |{" "}
              </span>
              <em>
                {entry.count - emptySeats()}&nbsp;/&nbsp;{entry.count}
              </em>
            </p>
          </div>
        ),
      });
    }
  });

  return timetableView;
}

function uuidFrequencies(uuids: string[]): Record<string, number> {
  const grouped = Object.groupBy(uuids, (id) => id);
  const frequencies: Record<string, number> = {};
  for (const uuid of uuids) {
    frequencies[uuid] = grouped[uuid]?.length ?? 0;
  }
  return frequencies;
}
