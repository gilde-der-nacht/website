import {
  ErrorBoundary,
  For,
  Show,
  Suspense,
  type JSX,
  type Resource,
} from "solid-js";
import { Box } from "@common/components/Box";
import { TXT } from "@common/utils/texts";
import type { ProgramEntry } from "@lst/components/anmeldung/api/save";
import { useParams } from "@solidjs/router";
import {
  type Public,
  type PublicProgramEntry,
} from "@lst/components/anmeldung/api/public";
import type { Result } from "@lst/components/anmeldung/api/elysium";
import { Chip } from "@common/components/Chip";
import { Icon } from "@common/components/Icon";
import { arr, obj, type Reactive } from "@common/utils/reactivity";
import { TextInputField } from "@common/components/newForm/Input";
import {
  getErrors,
  type Errors,
} from "@lst/components/anmeldung/constant/validation";
import { Entry } from "@lst/components/anmeldung/components/Entry";
import { parsePlainTime } from "@common/components/events";
import { defaultPlainDates } from "../constant/time";
import { TextareaField } from "@common/components/newForm/Textarea";

export function ErstellenDetail(props: {
  programEntries$: Reactive<ProgramEntry[]>;
  publicResource: Resource<Result<Public>>;
  link: (path: string) => string;
  isEditable: boolean;
}): JSX.Element {
  const uuid = useParams().uuid ?? "no-uuid-found";

  return (
    <Suspense fallback={<Box>{TXT.loading.program}</Box>}>
      <Show
        when={props.publicResource()}
        fallback={<Box type="danger">{TXT.error.help}</Box>}
      >
        {(publicData) => (
          <Show
            when={publicData().kind === "SUCCESS"}
            fallback={<Box type="danger">{TXT.loading.program}</Box>}
          >
            <ErrorBoundary
              fallback={
                <Box type="danger">
                  <p>Details konnten nicht geladen werden.</p>
                </Box>
              }
            >
              <ErstellenDetailContent
                entry$={arr.findExact(
                  props.programEntries$,
                  (e) => e.uuid === uuid,
                )}
                isEditable={props.isEditable}
                link={props.link}
              />
            </ErrorBoundary>
          </Show>
        )}
      </Show>
    </Suspense>
  );
}

function ErstellenDetailContent(props: {
  entry$: Reactive<ProgramEntry>;
  isEditable: boolean;
  link: (path: string) => string;
}): JSX.Element {
  const errors = () => getErrors(props.entry$.get());

  return (
    <>
      <h2>{props.entry$.get().title}</h2>
      <div class="dynamic-columns">
        <div>
          <form novalidate>
            <Show when={props.entry$.get().status === "published"}>
              <ErrorSummary errors={errors()} />
            </Show>

            <TextInputField
              value$={props.entry$.pipe(obj.sub("title"))}
              label="Titel"
              name="title"
              showErrors={
                props.entry$.get().status === "published" ? "ALWAYS" : "ON_BLUR"
              }
              errors={errors().byField.title ?? []}
              disabled={!props.isEditable}
            />

            <TextareaField
              value$={props.entry$.pipe(obj.sub("shortDescription"))}
              label="kurze Beschreibung"
              name="descriptionShort"
              size="small"
              showErrors={
                props.entry$.get().status === "published" ? "ALWAYS" : "ON_BLUR"
              }
              errors={errors().byField.shortDescription ?? []}
              disabled={!props.isEditable}
            />

            <TextareaField
              value$={props.entry$.pipe(obj.sub("longDescription"))}
              label="lange Beschreibung (optional)"
              name="descriptionLong"
              showErrors={
                props.entry$.get().status === "published" ? "ALWAYS" : "ON_BLUR"
              }
              errors={errors().byField.longDescription ?? []}
              disabled={!props.isEditable}
            />
          </form>
        </div>
        <div>
          <h3>Vorschau</h3>
          <br />
          <Chip kind={errors().hasErrors ? "danger" : "special"}>
            Status: {TXT.publishingSteps[props.entry$.get().status]}
            {errors().hasErrors ? (
              <span>
                {" "}
                mit Fehlern <Icon icon="triangle-exclamation" />
              </span>
            ) : (
              ""
            )}
          </Chip>
          <br />
          <br />
          <For
            each={toSlots(props.entry$.get())}
            fallback={<em>Keine (gültigen) Zeitslots gefunden</em>}
          >
            {(entry) => (
              <Entry
                entry={entry}
                basePath="/programm"
                link={props.link}
                reservations={0}
              />
            )}
          </For>
        </div>
      </div>
    </>
  );
}

function ErrorSummary(props: { errors: Errors }): JSX.Element {
  return (
    <Show when={props.errors.hasErrors}>
      <Box type="danger">
        <h4>Spielrunde inkomplett</h4>
        <p>
          Du hast noch einen oder mehre Fehler/fehlende Informationen in dieser
          Spielrunde:
        </p>
        <ul>
          <For each={props.errors.allErrors}>{(error) => <li>{error}</li>}</For>
        </ul>
      </Box>
    </Show>
  );
}

function toSlots(entry: ProgramEntry): PublicProgramEntry[] {
  const entries: PublicProgramEntry[] = [];
  entry.timeSlots.forEach((slot) => {
    const parsedStartTime = parsePlainTime(slot.start.time);
    const parsedEndTime = parsePlainTime(slot.end.time);
    if (parsedStartTime.kind === "ERROR" || parsedEndTime.kind === "ERROR") {
      return;
    }

    entries.push({
      uuid: slot.uuid,
      title: entry.title,
      organizer: "",
      timeSlot: {
        startDate: defaultPlainDates[slot.start.day].toPlainDateTime({
          hour: parsedStartTime.value.hour,
          minute: parsedStartTime.value.minute,
        }),
        endDate: defaultPlainDates[slot.end.day].toPlainDateTime({
          hour: parsedEndTime.value.hour,
          minute: parsedEndTime.value.minute,
        }),
      },
      shortDescription: entry.shortDescription,
      longDescription: entry.longDescription,
      participating: entry.participating,
      tagNames: entry.tagNames,
    });
  });
  return entries;
}
