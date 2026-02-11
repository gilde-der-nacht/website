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
import { type Public } from "@lst/components/anmeldung/api/public";
import type { Result } from "@lst/components/anmeldung/api/elysium";
import { Chip } from "@common/components/Chip";
import { Icon } from "@common/components/Icon";
import { arr, type Reactive } from "@common/utils/reactivity";

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
  const errors = getErrors(props.entry$.get());

  return (
    <>
      <Chip kind={errors.length > 0 ? "danger" : "special"}>
        Status: {TXT.publishingSteps[props.entry$.get().status]}
        {errors.length > 0 ? (
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
      <form novalidate>
        <ErrorSummary errors={errors} />
      </form>
    </>
  );
}

function getErrors(entry: ProgramEntry): string[] {
  const errors: string[] = [];

  if (entry.title.trim().length === 0) {
    errors.push("Titel ist ein Pflichtfeld");
  }
  return errors;
}

function ErrorSummary(props: { errors: string[] }): JSX.Element {
  return (
    <Show when={props.errors.length > 0}>
      <Box type="danger">
        <h4>Spielrunde inkomplett</h4>
        <p>
          Du hast noch einen oder mehre Fehler/fehlende Informationen in dieser
          Spielrunde:
        </p>
        <ul>
          <For each={props.errors}>{(error) => <li>{error}</li>}</For>
        </ul>
      </Box>
    </Show>
  );
}
