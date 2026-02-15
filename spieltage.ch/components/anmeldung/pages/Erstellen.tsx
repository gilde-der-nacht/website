import { For, Show, type JSX } from "solid-js";
import type { ProgramEntry } from "@lst/components/anmeldung/api/save";
import { BoxLink } from "@common/components/BoxLink";
import { TXT } from "@common/utils/texts";
import { A, useNavigate } from "@solidjs/router";
import { arr, type Reactive } from "@common/utils/reactivity";
import { Chip } from "@common/components/Chip";
import { getErrors } from "@lst/components/anmeldung/constant/validation";

export function Erstellen(props: {
  programEntries$: Reactive<ProgramEntry[]>;
  link: (path: string) => string;
  isEditable: boolean;
}): JSX.Element {
  const navigate = useNavigate();

  return (
    <>
      <ul class="link-list" role="list">
        <For each={props.programEntries$.get()}>
          {(entry) => {
            const errors = getErrors(entry);
            return (
              <li>
                <A
                  href={props.link(`/erstellen/${entry.uuid}`)}
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
                      Status: {TXT.publishingSteps[entry.status]}
                      {errors.hasErrors ? <span> mit Fehlern</span> : ""}
                    </Chip>
                  </BoxLink>
                </A>
              </li>
            );
          }}
        </For>
      </ul>
      <br />
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
              organizer: "",
              shortDescription: "",
              longDescription: "",
              participating: { kind: "LIMITED", maxSeats: 6 },
              timeSlots: [],
              tagNames: "",
            } satisfies ProgramEntry);
            navigate(props.link(`/erstellen/${uuid}`));
          }}
        >
          <h3>{TXT.createNewGameRound}</h3>
        </BoxLink>
      </Show>
    </>
  );
}
