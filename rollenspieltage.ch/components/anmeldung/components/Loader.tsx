import { Show, type JSX, type Resource } from "solid-js";
import type { Result } from "@rst/components/anmeldung/api/elysium";
import type { Program } from "@rst/components/anmeldung/api/program";
import { Box } from "@common/components/Box";
import { TXT } from "@common/utils/texts";

export function ShowProgramData(props: {
  programResource: Resource<Result<Program>>;
  children: JSX.Element | ((programData: Program) => JSX.Element);
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
          {typeof props.children === "function"
            ? props.children((result() as { data: Program }).data)
            : props.children}
        </Show>
      )}
    </Show>
  );
}
