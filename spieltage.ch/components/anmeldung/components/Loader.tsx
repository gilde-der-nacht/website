import { Show, type JSX, type Resource } from "solid-js";
import type { Result } from "@lst/components/anmeldung/api/elysium";
import { type Public } from "@lst/components/anmeldung/api/public";
import type { PublicAdmin } from "@lst/components/anmeldung/api/admin";
import { Box } from "@common/components/Box";
import { TXT } from "@common/utils/texts";

export function ShowPublicData(props: {
  publicResource: Resource<Result<Public>>;
  children: JSX.Element | ((publicData: Public) => JSX.Element);
}): JSX.Element {
  return (
    <Show
      when={props.publicResource()}
      fallback={<Box type="danger">{TXT.loading.program}</Box>}
    >
      {(result) => (
        <Show
          when={result().kind === "SUCCESS"}
          fallback={<Box type="danger">{TXT.error.help}</Box>}
        >
          {typeof props.children === "function"
            ? props.children((result() as { data: Public }).data)
            : props.children}
        </Show>
      )}
    </Show>
  );
}

export function ShowAdminData(props: {
  adminResource: Resource<Result<PublicAdmin>>;
  children: JSX.Element | ((adminData: PublicAdmin) => JSX.Element);
}): JSX.Element {
  return (
    <Show
      when={props.adminResource()}
      fallback={<Box type="danger">{TXT.loading.program}</Box>}
    >
      {(result) => (
        <Show
          when={result().kind === "SUCCESS"}
          fallback={<Box type="danger">{TXT.error.help}</Box>}
        >
          {typeof props.children === "function"
            ? props.children((result() as { data: PublicAdmin }).data)
            : props.children}
        </Show>
      )}
    </Show>
  );
}
