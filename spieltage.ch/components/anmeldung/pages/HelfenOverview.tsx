import { createSignal, Show, type JSX, type Resource } from "solid-js";
import type { HelpingReservation } from "@lst/components/anmeldung/api/save";
import type { Roles } from "@lst/components/anmeldung/api/meta";
import type { Result } from "@lst/components/anmeldung/api/elysium";
import { type DayFilterState } from "@common/components/Filter";
import type { Reactive } from "@common/utils/reactivity";
import { Box } from "@common/components/Box";
import type { PublicAdmin } from "@lst/components/anmeldung/api/admin";

export function HelfenOverview(props: {
  reservations$: Reactive<HelpingReservation[]>;
  adminResource: Resource<Result<PublicAdmin>>;
  link: (path: string) => string;
  roles: Roles;
}): JSX.Element {
  const [dayFilter, setDayFilter] = createSignal<DayFilterState>(null);

  return (
    <>
      <Show
        when={props.roles.includes("admin")}
        fallback={
          <Box type="danger">Du hast keinen Zugriff auf diesen Bereich.</Box>
        }
      >
        <Show when={props.adminResource()}>
          {(resource) => <Content adminResource={resource()} />}
        </Show>
      </Show>
    </>
  );
}

function Content(props: { adminResource: Result<PublicAdmin> }): JSX.Element {
  if (props.adminResource.kind === "FAILURE") {
    return null;
  }
  const { admin, erklaerbaer } = props.adminResource.data;
  return <></>;
}
