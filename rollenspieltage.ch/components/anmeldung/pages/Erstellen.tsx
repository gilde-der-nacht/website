import { For, Show, type JSX } from "solid-js";
import type { ProgramEntry } from "@rst/components/anmeldung/api/save";
import { BoxLink } from "@common/components/BoxLink";
import { TXT } from "@common/utils/texts";
import { arr, type Reactive } from "@common/utils/reactivity";
import { Chip } from "@common/components/Chip";
import { getErrors } from "@rst/components/anmeldung/constant/validation";
import { RouterLink, useLink } from "@common/components/Link";

export function Erstellen(props: {
  programEntries$: Reactive<ProgramEntry[]>;
  isEditable: boolean;
}): JSX.Element {
  const navigate = useLink();

  return (
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <ul class="link-list" role="list">
        <For each={props.programEntries$.get()}>
          {(entry) => {
            const errors = getErrors(entry);
            return (
              <li>
                <RouterLink
                  href={`/erstellen/${entry.uuid}`}
                  class="button-link"
                >
                  <BoxLink
                    icon={
                      errors.hasErrors ? "triangle-exclamation" : "arrow-right"
                    }
                    type={errors.hasErrors ? "danger" : "special"}
                  >
                    <h3>
                      {entry.title.trim().length === 0
                        ? "[Titel fehlt noch]"
                        : entry.title}
                    </h3>
                    <Chip kind={errors.hasErrors ? "danger" : "special"}>
                      Status:{" "}
                      {errors.hasErrors && entry.status === "published"
                        ? "Noch nicht "
                        : ""}
                      {TXT.publishingSteps[entry.status]}
                      {errors.hasErrors ? <span>, hat Fehler</span> : ""}
                    </Chip>
                  </BoxLink>
                </RouterLink>
              </li>
            );
          }}
        </For>
      </ul>
      <Show when={props.isEditable}>
        <BoxLink
          icon="grid-2-plus"
          type="success"
          onClick={() => {
            const uuid = crypto.randomUUID();
            arr.push(props.programEntries$, {
              uuid,
              status: "draft",
              title: "",
              shortDescription: "",
              longDescription: "",
              seats: {
                kind: "WITH_LIMIT",
                max: 6,
              },
              timeSlots: [],
              tagNames: "",
              language: "Deutsch",
              links: [],
            } satisfies ProgramEntry);

            navigate(`/erstellen/${uuid}`);
          }}
        >
          <h3>{TXT.createNewGameRound}</h3>
        </BoxLink>
      </Show>
    </div>
  );
}
