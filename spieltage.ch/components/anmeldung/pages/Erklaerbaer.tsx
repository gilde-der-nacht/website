import { Heading } from "@common/components/Heading";
import { For, Match, Show, Switch, type JSX, type Resource } from "solid-js";
import type {
  ErklaerbaerReservation,
  HelpingReservation,
  Save,
} from "@lst/components/anmeldung/api/save";
import { BoxLink } from "@common/components/BoxLink";
import { TXT } from "@common/utils/texts";
import { Box } from "@common/components/Box";
import { RadioGroup } from "@common/components/Radio";
import { InputInteger } from "@common/components/Input";
import type { Roles } from "@lst/components/anmeldung/api/meta";
import { openingHours } from "@lst/components/anmeldung/constant/time";
import { ExitSpa } from "@common/components/ExitSpa";
import { arr, obj, type Reactive } from "@common/utils/reactivity";
import type { Result } from "@lst/components/anmeldung/api/elysium";
import type {
  ErklaerbaerAdminEntry,
  PublicAdmin,
} from "@lst/components/anmeldung/api/admin";
import type { PerDay } from "@common/utils/time";

export function Erklaerbaer(props: {
  save$: Reactive<Save>;
  adminResource: Resource<Result<PublicAdmin>>;
  roles: Roles;
  isEditable: boolean;
}): JSX.Element {
  return (
    <>
      <p>
        Eines der Hauptziele der Luzerner Spieltage ist es, dass die
        Besucher/-innen noch nicht gespielte Spiele ausprobieren können. Dazu
        unterstützen uns jedes Jahr Freiwillige und erklären die ihnen bekannten
        Spiele aus der Spiele-Bibliothek. Diese Erklärbären sind durch ihr rotes
        T-Shirt erkennbar.
      </p>
      <br />
      <div class="dynamic-columns">
        <div>
          <ErklaerbaerJobs
            reservations$={props.save$.pipe(obj.sub("helping"))}
            roles={props.roles}
            isEditable={props.isEditable}
          />
        </div>
        <div>
          <Heading level={3} title="Was machen die Erklärbären" />
          <ul>
            <li>Sie müssen nicht alle Spiele der Spiele-Bibliothek kennen!</li>
            <li>
              Sie erklären Spiele während der eingeplanten Zeit
              <ul>
                <li>Grundsätzlich spielen die Erklärbären nicht mit</li>
                <li>
                  Sobald die Spieler/-innen die Regeln verstanden haben (z.B.
                  nach den ersten paar Runden) verlassen sie den Tisch
                </li>
                <li>
                  Sie stehen weiterhin für Fragen zur Verfügung und kommen
                  allenfalls periodisch zum Tisch zurück
                </li>
              </ul>
            </li>
            <li>
              Sie bringen Spiele für die Spiele-Bibliothek mit welche sie
              erklären können
              <ul>
                <li>
                  Diese Spiele sollen ein breites Spektrum, von einfach bis
                  komplex, abdecken
                </li>
                <li>
                  Eine Liste der mitgebrachten Spiele (Spiele-Bibliothek) wird
                  vor dem Event von allen Erklärbären zusammen erstellt
                </li>
                <li>
                  Vor dem Event notieren die Erklärbären, was sie aus der
                  Spiele-Bibliothek erklären können - (Mitbringen eigener Spiele
                  ist nicht Pflicht, falls genügend Spiele aus der Liste erklärt
                  werden können)
                </li>
              </ul>
            </li>
            <li>
              Sie erarbeiten gemeinsam vor dem Event eine Empfehlungsliste aus
              ca.&nbsp;6&nbsp;Spielen
              <ul>
                <li>
                  Alle Erklärbären sollen die Regeln dieser Spiele vor dem Event
                  lesen
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
      <Show when={props.adminResource()}>
        {(resource) => <ErklaerbaerOverview adminResource={resource()} />}
      </Show>
    </>
  );
}

function ErklaerbaerJobs(props: {
  reservations$: Reactive<HelpingReservation[]>;
  roles: Roles;
  isEditable: boolean;
}): JSX.Element {
  function getErklaerbaerJobs(): ErklaerbaerReservation[] {
    return props.reservations$
      .get()
      .filter((entry) => entry.kind === "ERKLAERBAER");
  }

  return (
    <>
      <Heading level={3} title="Meine Einsätze" />
      <br />
      <Switch
        fallback={
          <Box>
            <p>
              Bitte nimm mit uns <ExitSpa href="/kontakt">Kontakt</ExitSpa> auf,
              damit wir uns kurz mit dir absprechen und dir diesen Bereich
              freischalten können.
            </p>
          </Box>
        }
      >
        <Match when={props.roles.includes("erklaerbaer")}>
          <div style="display: grid; gap: 1rem;">
            <For
              each={getErklaerbaerJobs()}
              fallback={<em>Noch keine Einsätze eingetragen</em>}
            >
              {(job) => (
                <JobEntry
                  job={job}
                  updateJob={(j) => {
                    arr.update(
                      props.reservations$,
                      (entry) => entry.uuid === job.uuid,
                      j,
                    );
                  }}
                  removeJob={() => {
                    arr.remove(
                      props.reservations$,
                      (entry) => entry.uuid !== job.uuid,
                    );
                  }}
                  isEditable={props.isEditable}
                />
              )}
            </For>
            <Show when={props.isEditable}>
              <BoxLink
                icon="grid-2-plus"
                type="success"
                onClick={() => {
                  arr.push(props.reservations$, {
                    kind: "ERKLAERBAER",
                    uuid: crypto.randomUUID(),
                    slot: {
                      day: "SATURDAY",
                      from: 10,
                      to: 18,
                    },
                  });
                }}
              >
                <h3>{TXT.createNewEntry}</h3>
              </BoxLink>
            </Show>
          </div>
        </Match>
      </Switch>
    </>
  );
}

function JobEntry(props: {
  job: ErklaerbaerReservation;
  updateJob: (job: ErklaerbaerReservation) => void;
  removeJob: () => void;
  isEditable: boolean;
}): JSX.Element {
  function getWarnings(): string[] {
    const warnings: string[] = [];
    const { day, from, to } = props.job.slot;
    if (from >= to) {
      warnings.push("Das Ende muss grösser sein als der Start.");
    }

    const validHours = openingHours[day];
    const { from: validFrom, to: validTo } = validHours.open;
    if (validFrom > from) {
      warnings.push(
        `Die Spieltage öffnen am ${TXT.days[day]} erst um ${validFrom} Uhr.`,
      );
    }
    if (validTo < to) {
      warnings.push(
        `Die Spieltage schliessen am ${TXT.days[day]} um ${validTo} Uhr.`,
      );
    }

    return warnings;
  }

  return (
    <>
      <Box onClose={props.isEditable ? props.removeJob : undefined}>
        <h4>Tag</h4>
        <RadioGroup<"SATURDAY" | "SUNDAY">
          items={[
            {
              label: TXT.days["SATURDAY"],
              checked: props.job.slot.day === "SATURDAY",
              value: "SATURDAY",
            },
            {
              label: TXT.days["SUNDAY"],
              checked: props.job.slot.day === "SUNDAY",
              value: "SUNDAY",
            },
          ]}
          onValueUpdate={(day) => {
            props.updateJob({
              ...props.job,
              slot: { ...props.job.slot, day: day },
            });
          }}
          name={`day-entry-${props.job.uuid}`}
          layout="horizontal"
          disabled={!props.isEditable}
        />
        <br />
        <h4>Uhrzeit</h4>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">
          <InputInteger
            label="Start"
            name="from"
            value={props.job.slot.from}
            onValueUpdate={(newFrom) =>
              props.updateJob({
                ...props.job,
                slot: { ...props.job.slot, from: newFrom },
              })
            }
            disabled={!props.isEditable}
          />
          <InputInteger
            label="Ende"
            name="to"
            value={props.job.slot.to}
            onValueUpdate={(newTo) =>
              props.updateJob({
                ...props.job,
                slot: { ...props.job.slot, to: newTo },
              })
            }
            disabled={!props.isEditable}
          />
        </div>
        <Show when={getWarnings().length > 0}>
          <>
            <h5>Warnungen</h5>
            <ul>
              <For each={getWarnings()}>{(warning) => <li>{warning}</li>}</For>
            </ul>
          </>
        </Show>
      </Box>
    </>
  );
}

function ErklaerbaerOverview(props: {
  adminResource: Result<PublicAdmin>;
}): JSX.Element | null {
  if (props.adminResource.kind === "FAILURE") {
    return null;
  }
  if (props.adminResource.data.erklaerbaer === null) {
    return null;
  }

  const byDay = groupByDay(props.adminResource.data.erklaerbaer.entries);

  return (
    <>
      <h4>Übersicht über alle Erklärbären</h4>
      <div class="dynamic-columns">
        <div>
          <h5>Samstag</h5>
          <table>
            <tr>
              <th>Name</th>
              <th>Zeit</th>
            </tr>
            <tbody>
              <For each={byDay.SATURDAY}>
                {(entry) => (
                  <tr>
                    <td>{entry.name}</td>
                    <td>
                      {entry.slot.from} - {entry.slot.to} Uhr
                    </td>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        </div>
        <div>
          <h5>Sonntag</h5>
          <table>
            <tr>
              <th>Name</th>
              <th>Zeit</th>
            </tr>
            <tbody>
              <For each={byDay.SUNDAY}>
                {(entry) => (
                  <tr>
                    <td>{entry.name}</td>
                    <td>
                      {entry.slot.from} - {entry.slot.to} Uhr
                    </td>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function groupByDay(
  entries: ErklaerbaerAdminEntry[],
): PerDay<ErklaerbaerAdminEntry[]> {
  const { FRIDAY, SATURDAY, SUNDAY } = Object.groupBy(
    entries,
    (entry) => entry.slot.day,
  );

  return {
    FRIDAY: (FRIDAY ?? []).toSorted(
      (a, b) => a.slot.from - b.slot.from || a.slot.to - b.slot.to,
    ),
    SATURDAY: (SATURDAY ?? []).toSorted(
      (a, b) => a.slot.from - b.slot.from || a.slot.to - b.slot.to,
    ),
    SUNDAY: (SUNDAY ?? []).toSorted(
      (a, b) => a.slot.from - b.slot.from || a.slot.to - b.slot.to,
    ),
  };
}
