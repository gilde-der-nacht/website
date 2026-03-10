import { ErrorBoundary, For, Index, Show, type JSX } from "solid-js";
import { Box } from "@common/components/Box";
import { TXT } from "@common/utils/texts";
import type {
  Link,
  Participating,
  ProgramEntry,
  Slot,
} from "@lst/components/anmeldung/api/save";
import { useParams } from "@solidjs/router";
import {
  toPublic,
  type PublicProgramEntry,
} from "@lst/components/anmeldung/api/public";
import { Chip } from "@common/components/Chip";
import { Icon } from "@common/components/Icon";
import { arr, obj, type Reactive } from "@common/utils/reactivity";
import {
  NumberInputField,
  TextInputField,
} from "@common/components/newForm/Input";
import {
  getErrors,
  type Errors,
} from "@lst/components/anmeldung/constant/validation";
import { Entry } from "@lst/components/anmeldung/components/Entry";
import { TextareaField } from "@common/components/newForm/Textarea";
import { SwitchCheckbox } from "@common/components/newForm/SwitchCheckbox";
import { Button } from "@common/components/Button";
import { BoxLink } from "@common/components/BoxLink";
import { Temporal } from "@js-temporal/polyfill";

export function ErstellenDetail(props: {
  programEntries$: Reactive<ProgramEntry[]>;
  isEditable: boolean;
}): JSX.Element {
  const uuid = useParams().uuid ?? "no-uuid-found";

  return (
    <ErrorBoundary
      fallback={
        <Box type="danger">
          <p>Details konnten nicht geladen werden.</p>
        </Box>
      }
    >
      <ErstellenDetailContent
        entry$={arr.findExact(props.programEntries$, (e) => e.uuid === uuid)}
        isEditable={props.isEditable}
      />
    </ErrorBoundary>
  );
}

function ErstellenDetailContent(props: {
  entry$: Reactive<ProgramEntry>;
  isEditable: boolean;
}): JSX.Element {
  const errors = () => getErrors(props.entry$.get());

  return (
    <>
      <h2>{props.entry$.get().title}</h2>
      <div class="dynamic-columns">
        <div>
          <form novalidate>
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

            <TextInputField
              value$={props.entry$.pipe(obj.sub("organizer"))}
              label="Organisiert durch"
              name="organizer"
              showErrors={
                props.entry$.get().status === "published" ? "ALWAYS" : "ON_BLUR"
              }
              errors={errors().byField.organizer ?? []}
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

            <ParticipationInput
              value$={props.entry$.pipe(obj.sub("participating"))}
            />

            <TimeSlotInput slots$={props.entry$.pipe(obj.sub("timeSlots"))} />

            <TextInputField
              value$={props.entry$.pipe(obj.sub("tagNames"))}
              label="Tags"
              name="tags"
              showErrors={
                props.entry$.get().status === "published" ? "ALWAYS" : "ON_BLUR"
              }
              errors={errors().byField.tags ?? []}
              disabled={!props.isEditable}
            />

            <TextInputField
              value$={props.entry$.pipe(obj.sub("materialLanguage"))}
              label="Sprache Spielmaterial"
              name="materialLanguage"
              showErrors={
                props.entry$.get().status === "published" ? "ALWAYS" : "ON_BLUR"
              }
              errors={errors().byField.materialLanguage ?? []}
              disabled={!props.isEditable}
            />

            <LinkInput links$={props.entry$.pipe(obj.sub("links"))} />
          </form>
        </div>
        <div>
          <h3>Vorschau</h3>
          <br />
          <div style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: center; justify-content: space-between;">
            <Chip kind={errors().hasErrors ? "danger" : "special"}>
              Status:{" "}
              {errors().hasErrors && props.entry$.get().status === "published"
                ? "noch nicht "
                : ""}
              {TXT.publishingSteps[props.entry$.get().status]}
              {errors().hasErrors ? (
                <span>
                  , hat Fehler <Icon icon="triangle-exclamation" />
                </span>
              ) : (
                ""
              )}
            </Chip>
            <SwitchCheckbox
              value$={
                props.entry$.pipe(obj.sub("status")) as Reactive<
                  "draft" | "published"
                >
              }
              options={{
                left: {
                  label: "Entwurf / Archiviert",
                  value: "draft",
                },
                right: {
                  label: "Veröffentlicht",
                  value: "published",
                },
              }}
              name="status"
            />
          </div>
          <br />

          <Show when={props.entry$.get().status === "published"}>
            <ErrorSummary errors={errors()} />
          </Show>
          <br />

          <ul role="list" class="link-list">
            <For
              each={toSlots(props.entry$.get())}
              fallback={
                <em>
                  {errors().hasErrors
                    ? "Korrigiere die Fehler, um eine Vorschau zu erhalten."
                    : "Keine (gültigen) Zeitslots gefunden."}
                </em>
              }
            >
              {(entry) => <Entry entry={entry} basePath="/programm" />}
            </For>
          </ul>
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
    const transformedPublic = toPublic({
      uuid: slot.uuid,
      title: entry.title,
      organizer: entry.organizer,
      dateTimeRange: slot,
      shortDescription: entry.shortDescription,
      longDescription: entry.longDescription,
      participating:
        entry.participating.kind === "NONE"
          ? entry.participating
          : {
              kind: "LIMITED",
              maxSeats: entry.participating.maxSeats,
              reserved: [],
            },
      tagNames: entry.tagNames,
      materialLanguage: entry.materialLanguage,
      links: entry.links,
    });

    if (transformedPublic !== null) {
      entries.push(transformedPublic);
    }
  });

  return entries.toSorted(
    (a, b) =>
      Temporal.PlainDate.compare(a.slot.day, b.slot.day) ||
      Temporal.PlainTime.compare(a.slot.start, b.slot.start) ||
      Temporal.PlainTime.compare(a.slot.end, b.slot.end),
  );
}

function ParticipationInput(props: {
  value$: Reactive<Participating>;
}): JSX.Element {
  const options = {
    left: { label: "Keine Anmeldung", value: "NONE" as const },
    right: { label: "Limitierte Plätze", value: "LIMITED" as const },
  };

  return (
    <>
      <SwitchCheckbox
        value$={props.value$.pipe(obj.sub("kind"))}
        options={options}
        name="participating"
      />

      <Show when={props.value$.get().kind === "LIMITED"}>
        <NumberInputField
          value$={props.value$.pipe(obj.sub("maxSeats"))}
          label="Maximale Plätze"
          name="maxSeats"
        />
      </Show>
    </>
  );
}

function TimeSlotInput(props: { slots$: Reactive<Slot[]> }): JSX.Element {
  return (
    <>
      <label>Zeitfenster</label>
      <ul role="list" class="link-list">
        <Index each={arr.unpack(props.slots$)}>
          {(slot) => {
            return (
              <li>
                <Box onClose={slot().remove}>
                  <div style="display: grid; gap: 1rem;">
                    <div>
                      <label>Tag</label>
                      <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                        <Button
                          label="Samstag"
                          kind={
                            slot().get().start.day === "SATURDAY"
                              ? "success"
                              : "gray"
                          }
                          onClick={() => {
                            slot().update((s) => ({
                              ...s,
                              start: { ...s.start, day: "SATURDAY" },
                              end: { ...s.end, day: "SATURDAY" },
                            }));
                          }}
                        />
                        <Button
                          label="Sonntag"
                          kind={
                            slot().get().start.day === "SUNDAY"
                              ? "success"
                              : "gray"
                          }
                          onClick={() => {
                            slot().update((s) => ({
                              ...s,
                              start: { ...s.start, day: "SUNDAY" },
                              end: { ...s.end, day: "SUNDAY" },
                            }));
                          }}
                        />
                      </div>
                    </div>
                    <TextInputField
                      value$={slot()
                        .pipe(obj.sub("start"))
                        .pipe(obj.sub("time"))}
                      label="Start"
                      name="start"
                    />
                    <TextInputField
                      value$={slot().pipe(obj.sub("end")).pipe(obj.sub("time"))}
                      label="Ende"
                      name="end"
                    />
                  </div>
                </Box>
              </li>
            );
          }}
        </Index>
        <li>
          <BoxLink
            icon="circle-plus"
            type="success"
            onClick={() =>
              arr.push(props.slots$, {
                uuid: crypto.randomUUID(),
                start: {
                  day: "SATURDAY",
                  time: "10:00",
                },
                end: {
                  day: "SATURDAY",
                  time: "12:00",
                },
              })
            }
          >
            <h3>Neues Zeitfenster</h3>
          </BoxLink>
        </li>
      </ul>
    </>
  );
}

function LinkInput(props: { links$: Reactive<Link[]> }): JSX.Element {
  return (
    <>
      <label>Links</label>
      <ul role="list" class="link-list">
        <Index each={arr.unpack(props.links$)}>
          {(link) => {
            return (
              <li>
                <Box onClose={link().remove}>
                  <div style="display: grid; gap: 1rem;">
                    <TextInputField
                      value$={link().pipe(obj.sub("label"))}
                      label="Label"
                      name="label"
                    />
                    <TextInputField
                      value$={link().pipe(obj.sub("link"))}
                      label="Link"
                      name="link"
                    />
                  </div>
                </Box>
              </li>
            );
          }}
        </Index>
        <li>
          <BoxLink
            icon="circle-plus"
            type="success"
            onClick={() =>
              arr.push(props.links$, {
                label: "",
                link: "",
              })
            }
          >
            <h3>Neuer Link</h3>
          </BoxLink>
        </li>
      </ul>
    </>
  );
}
