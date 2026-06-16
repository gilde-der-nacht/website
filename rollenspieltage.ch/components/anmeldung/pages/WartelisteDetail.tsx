import { Show, type Accessor, type JSX } from "solid-js";
import type {
  Program,
  ProgramPublicEntry,
} from "@rst/components/anmeldung/api/program";
import type { Roles } from "@rst/components/anmeldung/api/meta";
import { useParams } from "@solidjs/router";
import { Box } from "@common/components/Box";
import { TXT } from "@common/utils/texts";
import { getDay } from "@rst/components/anmeldung/constant/time";
import { formatTime } from "@common/utils/time";
import { Temporal } from "@js-temporal/polyfill";
import { RouterLink } from "@common/components/Link";
import { BoxLink } from "@common/components/BoxLink";

export function WartelisteDetail(props: {
  programData: Accessor<Program>;
  isEditable: boolean;
  roles: Roles;
}): JSX.Element {
  const uuid = useParams().uuid ?? "no-uuid-found";

  return (
    <Show
      when={props
        .programData()
        .publicEntries.find((e) => e.timeSlot.uuid === uuid)}
      fallback={<Box type="danger">{TXT.error.gameroundUuidError}</Box>}
    >
      {(entry) => (
        <WartelisteDetailContent
          entry={entry()}
          isEditable={props.isEditable}
          programData={props.programData}
          roles={props.roles}
        />
      )}
    </Show>
  );
}

function WartelisteDetailContent(props: {
  entry: ProgramPublicEntry;
  isEditable: boolean;
  programData: Accessor<Program>;
  roles: Roles;
}): JSX.Element {
  const day = () =>
    Temporal.PlainDate.from(props.entry.timeSlot.slot.start.day);
  const startTime = () =>
    Temporal.PlainTime.from(props.entry.timeSlot.slot.start.time);
  const endTime = () =>
    startTime().add(Temporal.Duration.from(props.entry.timeSlot.slot.duration));

  return (
    <>
      <h2>Warteliste</h2>
      <RouterLink
        href={`/programm/${props.entry.timeSlot.uuid}`}
        class="button-link"
      >
        <BoxLink icon="backward">
          <h6 style="margin: 0;">Zurück zur Spielrunde</h6>
          <h4>{props.entry.title}</h4>
          <h5 style="margin: 0;">
            {TXT.days[getDay(day()) ?? "FRIDAY"]}, {formatTime(startTime())} -{" "}
            {formatTime(endTime())} Uhr
          </h5>
        </BoxLink>
      </RouterLink>
    </>
  );
}
