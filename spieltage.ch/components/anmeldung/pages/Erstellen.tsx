import { Show, type JSX, type Resource } from "solid-js";
import type { ProgramEntry } from "@lst/components/anmeldung/api/save";
import type { Public } from "@lst/components/anmeldung/api/public";
import type { Result } from "@lst/components/anmeldung/api/elysium";
import { BoxLink } from "@common/components/BoxLink";
import { TXT } from "@common/utils/texts";
import { useNavigate } from "@solidjs/router";
import { arr, type Reactive } from "@common/utils/reactivity";

export function Erstellen(props: {
  programEntries$: Reactive<ProgramEntry[]>;
  publicResource: Resource<Result<Public>>;
  link: (path: string) => string;
  isEditable: boolean;
}): JSX.Element {
  const navigate = useNavigate();

  return (
    <>
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
              playerMax: 6,
              slots: [],
              tagNames: [],
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
