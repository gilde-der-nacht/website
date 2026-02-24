import { Box } from "@common/components/Box";
import type { Reactive } from "@common/utils/reactivity";
import { For, Show, Suspense, type JSX, type Resource } from "solid-js";
import type { Save } from "@lst/components/anmeldung/api/save";
import type { Result } from "@lst/components/anmeldung/api/elysium";
import type { Public } from "@lst/components/anmeldung/api/public";
import { TXT } from "@common/utils/texts";
import { Entry } from "../components/Entry";

export function Programm(props: {
  save$: Reactive<Save>;
  publicResource: Resource<Result<Public>>;
  link: (path: string) => string;
}): JSX.Element {
  return (
    <Suspense fallback={<Box>{TXT.loading.program}</Box>}>
      <Show
        when={props.publicResource()}
        fallback={<Box type="danger">{TXT.error.help}</Box>}
      >
        {(publicData) => (
          <Show
            when={publicData().kind === "SUCCESS"}
            fallback={<Box type="danger">{TXT.error.program}</Box>}
          >
            <ProgramView
              save={props.save$.get()}
              publicState={(publicData() as { data: Public }).data}
              link={props.link}
            />
          </Show>
        )}
      </Show>
    </Suspense>
  );
}

function ProgramView(props: {
  save: Save;
  publicState: Public;
  link: (path: string) => string;
}): JSX.Element {
  return (
    <ul role="list" class="event-list">
      <For each={props.publicState.programEntries}>
        {(entry) => (
          <Entry entry={entry} basePath="/programm" link={props.link} />
        )}
      </For>
    </ul>
  );
}
