import {
  createSignal,
  Show,
  Suspense,
  type JSX,
  type Resource,
} from "solid-js";
import { Icon } from "@common/components/Icon";
import type { PerDay, PlainTimeRange, ProgramDay } from "@common/utils/time";
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
import type { HelpingReservation } from "@lst/components/anmeldung/api/save";
import { Box } from "@common/components/Box";
import { TXT } from "@common/utils/texts";
import {
  type Public,
  type Reservations,
} from "@lst/components/anmeldung/api/public";
import type { Roles } from "@lst/components/anmeldung/api/meta";
import { BoxLink } from "@common/components/BoxLink";
import type { Result } from "@lst/components/anmeldung/api/elysium";
import { getDay } from "@lst/components/anmeldung/constant/time";
import { DayFilter, type DayFilterState } from "@common/components/Filter";
import { Temporal } from "@js-temporal/polyfill";
import type { Reactive } from "@common/utils/reactivity";
import { Link } from "@common/components/Link";

export function Helfen(props: {
  reservations$: Reactive<HelpingReservation[]>;
  publicResource: Resource<Result<Public>>;
  isEditable: boolean;
  roles: Roles;
}): JSX.Element {
  const [dayFilter, setDayFilter] = createSignal<DayFilterState>(null);

  return (
    <>
      <div class="dynamic-columns">
        <p>
          Beim Kiosk und der Essensausgabe können wir immer ein paar helfende
          Hände gebrauchen. Wenn du bereit bist zu helfen, klicke in der
          jeweiligen Stunde auf das Handsymbol <Icon icon="hand-heart" />.
        </p>
        <Show when={props.roles.includes("admin")}>
          <Link
            href="/helfen/admin"
            class="button-link"
            style="margin-block-end: 1rem; padding: 0;"
          >
            <BoxLink icon="forward" type="danger">
              <h4>Helfer-Übersicht (Admin)</h4>
            </BoxLink>
          </Link>
        </Show>
      </div>
      <br />

      <Box type="special">
        Melde bitte 15 Minuten vor Schichtbeginn bei einem OK-Mitglied, beim{" "}
        <a href="/adresse">Eingang zum Würzenbachsaal.</a>
      </Box>

      <br />
      <h3>Erklärbären</h3>
      <br />
      <div class="dynamic-columns">
        <p>
          Eines der Hauptziele der Luzerner Spieltage ist es, dass die
          Besucher/-innen noch nicht gespielte Spiele ausprobieren können. Dazu
          unterstützen uns jedes Jahr Freiwillige und erklären die ihnen
          bekannten Spiele aus der Spiele-Bibliothek. Diese Erklärbären sind
          durch ihr rotes T-Shirt erkennbar.
        </p>
        <Link
          href="/erklaerbaer"
          class="button-link"
          style="margin-block-end: 1rem; padding: 0;"
        >
          <BoxLink icon="forward" type="success">
            <h4>Zur Anmeldung für Erklärbären</h4>
          </BoxLink>
        </Link>
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
                myHelpReservations={props.reservations$.get()}
                allReservations={
                  (publicData() as { data: Public }).data.reservations
                }
                isEditable={props.isEditable}
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
  dayFilter: ProgramDay | null;
}): JSX.Element {
  const entries = () =>
    ({
      FRIDAY: aggregateEntries({
        day: "FRIDAY",
        entries: helpTimes,
        allReservations: props.allReservations,
        myReservations: props.myHelpReservations,
      }),
      SATURDAY: aggregateEntries({
        day: "SATURDAY",
        entries: helpTimes,
        allReservations: props.allReservations,
        myReservations: props.myHelpReservations,
      }),
      SUNDAY: aggregateEntries({
        day: "SUNDAY",
        entries: helpTimes,
        allReservations: props.allReservations,
        myReservations: props.myHelpReservations,
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
  allReservations: Reservations;
  myReservations: HelpingReservation[];
}): ProgramEntryTimetableView[] {
  const timetableView: ProgramEntryTimetableView[] = [];

  const byDay = Object.groupBy(
    props.entries,
    (entry) => getDay(entry.dateTime.startDate) ?? "empty",
  );

  byDay[props.day]?.forEach((entry) => {
    const emptySeats = () =>
      entry.count -
      (props.allReservations[entry.uuid] ?? 0) -
      props.myReservations.filter(
        (r) => "entryUuid" in r && r.entryUuid === entry.uuid,
      ).length;

    const helpingMyself = () =>
      props.myReservations.filter(
        (r) => "entryUuid" in r && r.entryUuid === entry.uuid,
      ).length > 0;

    const classes = () => {
      const cls = ["box-simple", "timeview-entry"];
      if (helpingMyself()) {
        cls.push("success");
      } else if (emptySeats() === 0) {
        cls.push("gray");
      }
      return cls.join(" ");
    };

    const range: PlainTimeRange = {
      startTime: Temporal.PlainTime.from({
        hour: entry.dateTime.startDate.hour,
        minute: entry.dateTime.startDate.minute,
      }),
      endTime:
        entry.dateTime.startDate.day !== entry.dateTime.endDate.day
          ? Temporal.PlainTime.from({
              hour: entry.dateTime.endDate.hour,
              minute: entry.dateTime.endDate.minute,
            })
          : Temporal.PlainTime.from({
              hour: entry.dateTime.endDate.hour,
              minute: entry.dateTime.endDate.minute,
            }),
    };

    timetableView.push({
      range,
      component: () => (
        <Link
          href={`/helfen/${entry.uuid}`}
          style="display: block; border: none;"
        >
          <div class={classes()} style="height: 100%;">
            <Chip
              title="Helfer:innen gesucht"
              inverted={helpingMyself() || emptySeats() === 0}
              size="small"
            >
              HL
            </Chip>
            <IconOnlyButton icon="hand-heart" kind="ghost" title="Helfen" />
            <h5 title={helpTypes[entry.kind].title}>
              {helpTypes[entry.kind].title}
            </h5>
            <p class="duration">
              <span>
                {range.startTime.hour}-{range.endTime.hour}
                &nbsp;Uhr |{" "}
              </span>
              <em>
                {entry.count - emptySeats()}&nbsp;/&nbsp;{entry.count}
              </em>
            </p>
          </div>
        </Link>
      ),
    });
  });

  return timetableView;
}
