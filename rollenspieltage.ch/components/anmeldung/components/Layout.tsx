import { For, Show, type Accessor, type JSX, type Resource } from "solid-js";
import {
  QuickMenu,
  QuickMenuExtended,
} from "@rst/components/anmeldung/components/QuickMenu";
import type { Result } from "@rst/components/anmeldung/api/elysium";
import { ShowProgramData } from "@rst/components/anmeldung/components/Loader";
import { Box } from "@common/components/Box";
import type { Program } from "@rst/components/anmeldung/api/program";
import type { Save } from "@rst/components/anmeldung/api/save";
import { findConflicts, type Conflicts } from "@common/components/Timetable";
import { Icon } from "@common/components/Icon";
import { aggregateEntries } from "@rst/components/anmeldung/components/Timeview";
import { obj, type Reactive } from "@common/utils/reactivity";
import type { RegistrationUuid } from "@common/utils/ids";
import type { AppStore } from "@rst/components/anmeldung/components/Router";

export function Layout(props: {
  title?: string;
  showQuickmenu?: boolean;
  store$: Reactive<AppStore>;
  secret: RegistrationUuid;
  parentPath?: string;
  programResource: Resource<Result<Program>>;
  children: (data: { programData: Accessor<Program> }) => JSX.Element;
}): JSX.Element {
  return (
    <div class="page">
      {props.showQuickmenu !== false ? (
        <QuickMenu
          roles$={props.store$.pipe(obj.sub("meta")).pipe(obj.sub("roles"))}
          saveState$={props.store$
            .pipe(obj.sub("meta"))
            .pipe(obj.sub("saveState"))}
          lastSaved$={props.store$
            .pipe(obj.sub("meta"))
            .pipe(obj.sub("lastSaved"))}
          parentPath={props.parentPath ?? "/"}
        />
      ) : null}
      <div class="page-content">
        <Show when={props.title !== undefined && props.title.trim().length > 0}>
          <h2 style="margin-block-end: 1rem;">{props.title}</h2>
        </Show>
        <ShowProgramData programResource={props.programResource}>
          {(programData) => (
            <>
              <AllConflicts
                save$={props.store$.pipe(obj.sub("save"))}
                programData={programData}
                secret={props.secret}
              />
              {props.children({ programData })}
            </>
          )}
        </ShowProgramData>
      </div>
      {props.showQuickmenu !== false ? (
        <div class="extended-wrapper" style="margin-block-start: 1rem;">
          <QuickMenuExtended
            roles$={props.store$.pipe(obj.sub("meta")).pipe(obj.sub("roles"))}
            saveState$={props.store$
              .pipe(obj.sub("meta"))
              .pipe(obj.sub("saveState"))}
            lastSaved$={props.store$
              .pipe(obj.sub("meta"))
              .pipe(obj.sub("lastSaved"))}
            parentPath={props.parentPath ?? "/"}
          />
        </div>
      ) : null}
    </div>
  );
}

function AllConflicts(props: {
  save$: Reactive<Save>;
  programData: Accessor<Program>;
  secret: RegistrationUuid;
}): JSX.Element {
  const personalProgram = () =>
    aggregateEntries({
      save$: props.save$,
      programData: props.programData,
      secret: props.secret,
    });
  const conflictingEntriesSaturday = () =>
    findConflicts(personalProgram().SATURDAY);
  const conflictingEntriesSunday = () =>
    findConflicts(personalProgram().SUNDAY);

  return (
    <Show
      when={
        conflictingEntriesSaturday().length > 0 ||
        conflictingEntriesSunday().length > 0
      }
    >
      <div style="position: sticky; top: 0; background: #ffffffcc; padding-block: 1rem; z-index: 1;">
        <ConflictsOfDay
          conflicts={conflictingEntriesSaturday()}
          day="Samstag"
        />
        <ConflictsOfDay conflicts={conflictingEntriesSunday()} day="Sonntag" />
      </div>
    </Show>
  );
}

function ConflictsOfDay(props: {
  conflicts: Conflicts;
  day: string;
}): JSX.Element {
  return (
    <Show when={props.conflicts.length > 0}>
      <Box type="danger">
        <p>
          Konflikte am <strong>{props.day}</strong> gefunden! Bitte stelle
          sicher, dass du nicht zeitlich überlappende Spielrunden eingetragen
          hast:
        </p>
      </Box>
      <For each={props.conflicts}>
        {([a, b]) => (
          <div style="display: grid; grid-template-columns: 1fr max-content 1fr; gap: 1rem; margin-block: 0.5rem;">
            {a.component()}
            <span style="color: var(--clr-warning-10); align-self: center; font-size: 2rem;">
              <Icon icon="triangle-exclamation" />
            </span>
            {b.component()}
          </div>
        )}
      </For>
    </Show>
  );
}
