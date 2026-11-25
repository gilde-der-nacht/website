import { Show, type Accessor, type SourceAccessor } from "solid-js";
import type { JSX } from "@solidjs/web";
import type { Result } from "@rst/components/anmeldung/api/elysium";
import type { Program } from "@rst/components/anmeldung/api/program";
import { Box } from "@common/components/Box";
import { TXT } from "@common/utils/texts";

export function ShowProgramData(props: {
  programResource: SourceAccessor<Result<Program>>;
  children: (programData: Accessor<Program>) => JSX.Element;
}): JSX.Element {
  return (
    <Show
      when={props.programResource()}
      fallback={<Box type="danger">{TXT.loading.program}</Box>}
    >
      {(result) => (
        <Show
          when={result().kind === "SUCCESS"}
          fallback={<Box type="danger">{TXT.error.help}</Box>}
        >
          {(_) => props.children(() => (result() as { data: Program }).data)}
        </Show>
      )}
    </Show>
  );
}
