import {
  createEffect,
  ErrorBoundary,
  For,
  Index,
  Show,
  type JSX,
} from "solid-js";
import { Box } from "@common/components/Box";
import { TXT } from "@common/utils/texts";
import type {
  Contact,
  Link,
  ProgramEntry,
  TimeSlotEdit,
} from "@rst/components/anmeldung/api/save";
import { useParams } from "@solidjs/router";
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
} from "@rst/components/anmeldung/constant/validation";
import { Entry } from "@rst/components/anmeldung/components/Entry";
import { TextareaField } from "@common/components/newForm/Textarea";
import {
  SwitchCheckbox,
  SwitchCheckboxLegacy,
} from "@common/components/newForm/SwitchCheckbox";
import { Button } from "@common/components/Button";
import { BoxLink } from "@common/components/BoxLink";
import { parseIntSafe } from "@common/utils/parsing";
import { entryEditToPublic } from "@rst/components/anmeldung/utils/convert";
import { SATURDAY, SUNDAY } from "@rst/components/anmeldung/constant/time";
import type { Roles } from "@rst/components/anmeldung/api/meta";

export function ErstellenDetail(props: {
  programEntries$: Reactive<ProgramEntry[]>;
  contact$: Reactive<Contact>;
  isEditable: boolean;
  roles: Roles;
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
        contact$={props.contact$}
        isEditable={props.isEditable}
        roles={props.roles}
      />
    </ErrorBoundary>
  );
}

function ErstellenDetailContent(props: {
  entry$: Reactive<ProgramEntry>;
  contact$: Reactive<Contact>;
  isEditable: boolean;
  roles: Roles;
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
              value$={props.contact$.pipe(obj.sub("name"))}
              label="Spielleitung"
              name="gamemaster"
              disabled
            />

            <TextareaField
              value$={props.entry$.pipe(obj.sub("shortDescription"))}
              label="kurze Beschreibung (max. 200 Zeichen)"
              name="descriptionShort"
              size="small"
              showErrors="ALWAYS"
              errors={errors().byField.shortDescription ?? []}
              disabled={!props.isEditable}
            />

            <TextareaField
              value$={props.entry$.pipe(obj.sub("longDescription"))}
              label="lange Beschreibung (optional)"
              name="descriptionLong"
              showErrors="ALWAYS"
              errors={errors().byField.longDescription ?? []}
              disabled={!props.isEditable}
            />

            <Show when={props.entry$.get().seats.kind === "WITH_LIMIT"}>
              <NumberInputField
                value$={props.entry$
                  .pipe(obj.sub("seats"))
                  .pipe(obj.sub("max"))}
                label="Maximale Plätze"
                name="maxSeats"
                errors={errors().byField.seats ?? []}
              />
            </Show>

            <TimeSlotInput
              slots$={props.entry$.pipe(obj.sub("timeSlots"))}
              byFieldUuid={errors().byFieldUuid}
            />

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
            <p style="background: white;">
              <em>
                Vorschläge für Tags: <br />
                <span style="display: flex; flex-wrap: wrap; column-gap: 0.5ch;">
                  <span>Ab 6 Jahren,</span>
                  <span>Ab 9 Jahren,</span>
                  <span>Ab 12 Jahren,</span>
                  <span>Ab 18 Jahren,</span>
                  <span>Fantasy,</span>
                  <span>Science Fiction,</span>
                  <span>Postapokalyptisch,</span>
                  <span>Horror,</span>
                  <span>Modern,</span>
                  <span>Historisch,</span>
                  <span>Offene Welt,</span>
                  <span>Gemeinsame Spielleitung,</span>
                  <span>Regelleicht</span>
                </span>
              </em>
            </p>

            <div style="display: flex; gap: 1rem; align-items: baseline;">
              <legend style="margin: 0; padding: 0;">Sprache:</legend>
              <SwitchCheckboxLegacy
                value={
                  props.entry$.pipe(obj.sub("language")).get() === "Englisch"
                    ? "Englisch"
                    : "Deutsch"
                }
                onChange={(newValue) =>
                  props.entry$.pipe(obj.sub("language")).set(newValue)
                }
                options={{
                  left: { label: "Englisch", value: "Englisch" },
                  right: { label: "Deutsch", value: "Deutsch" },
                }}
                name="participating"
              />
            </div>

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

          <ErrorSummary errors={errors()} />
          <br />

          <ul role="list" class="link-list">
            <For
              each={entryEditToPublic(
                props.entry$.get(),
                props.contact$.get().name,
              )}
              fallback={
                <em>
                  {errors().hasErrors
                    ? "Korrigiere die Fehler, um eine Vorschau zu erhalten."
                    : "Keine (gültigen) Zeitslots gefunden."}
                </em>
              }
            >
              {(entry) => (
                <Entry entry={entry} basePath="/programm" roles={props.roles} />
              )}
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
          <For
            each={props.errors.allErrors.map((error) => {
              if (error.includes("200")) {
                return "Die kurze Beschreibung ist auf 200 Zeichen limitiert.";
              }
              if (error.includes("500")) {
                return "Die lange Beschreibung ist auf 500 Zeichen limitiert.";
              }
              return error;
            })}
          >
            {(error) => <li>{error}</li>}
          </For>
        </ul>
      </Box>
    </Show>
  );
}

function TimeSlotInput(props: {
  slots$: Reactive<TimeSlotEdit[]>;
  byFieldUuid: Record<string, string[]>;
}): JSX.Element {
  return (
    <>
      <label>Zeitfenster</label>
      <ul role="list" class="link-list">
        <Index each={arr.unpack(props.slots$)}>
          {(slot$) => {
            const errors = () => props.byFieldUuid[slot$().get().uuid] ?? [];

            return (
              <li>
                <Box onClose={slot$().remove}>
                  <div style="display: grid; gap: 1rem;">
                    <div>
                      <label>Tag</label>
                      <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                        <Button
                          label="Samstag"
                          kind={
                            slot$().get().slot.start.day === SATURDAY.toJSON()
                              ? "success"
                              : "gray"
                          }
                          onClick={() => {
                            slot$()
                              .pipe(obj.sub("slot"))
                              .update((s) => ({
                                ...s,
                                start: { ...s.start, day: SATURDAY.toJSON() },
                              }));
                          }}
                        />
                        <Button
                          label="Sonntag"
                          kind={
                            slot$().get().slot.start.day === SUNDAY.toJSON()
                              ? "success"
                              : "gray"
                          }
                          onClick={() => {
                            slot$()
                              .pipe(obj.sub("slot"))
                              .update((s) => ({
                                ...s,
                                start: { ...s.start, day: SUNDAY.toJSON() },
                              }));
                          }}
                        />
                      </div>
                    </div>
                    <TextInputField
                      value$={slot$()
                        .pipe(obj.sub("slot"))
                        .pipe(obj.sub("start"))
                        .pipe(obj.sub("time"))}
                      onBlur={() => {
                        const startTime$ = slot$()
                          .pipe(obj.sub("slot"))
                          .pipe(obj.sub("start"))
                          .pipe(obj.sub("time"));
                        const startTime = startTime$.get();
                        const [hour, minute] = startTime.split(".");
                        const parsed = parseIntSafe(hour ?? "");
                        if (parsed !== null) {
                          startTime$.set(
                            String(parsed).length === 1
                              ? `0${parsed}:${minute ?? "00"}`
                              : `${parsed}:${minute ?? "00"}`,
                          );
                        }
                      }}
                      label="Start"
                      name="start"
                    />
                    <TextInputField
                      value$={slot$()
                        .pipe(obj.sub("slot"))
                        .pipe(obj.sub("end"))
                        .pipe(obj.sub("time"))}
                      onBlur={() => {
                        const endTime$ = slot$()
                          .pipe(obj.sub("slot"))
                          .pipe(obj.sub("end"))
                          .pipe(obj.sub("time"));
                        const startTime = endTime$.get();
                        const [hour, minute] = startTime.split(".");
                        const parsed = parseIntSafe(hour ?? "");
                        if (parsed !== null) {
                          endTime$.set(
                            String(parsed).length === 1
                              ? `0${parsed}:${minute ?? "00"}`
                              : `${parsed}:${minute ?? "00"}`,
                          );
                        }
                      }}
                      errors={errors()}
                      showErrors="ALWAYS"
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
                slot: {
                  start: {
                    day: SATURDAY.toJSON(),
                    time: "10:00",
                  },
                  end: {
                    time: "12:00",
                  },
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
