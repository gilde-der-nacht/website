import { Button, ButtonWithIcon } from "@common/components/Button";
import { Icon } from "@common/components/Icon";
import { Tooltip } from "@common/components/Tooltip";
import type { JSX } from "solid-js/jsx-runtime";
import type { Roles, SaveState } from "@rst/components/anmeldung/api/meta";
import { Match, Show, Switch } from "solid-js";
import { Box } from "@common/components/Box";
import { formatDateTime } from "@common/components/utils";
import { RouterLink } from "@common/components/Link";
import type { Reactive } from "@common/utils/reactivity";

export function QuickMenu(props: {
  roles$: Reactive<Roles>;
  saveState$: Reactive<SaveState>;
  lastSaved$: Reactive<Date>;
  parentPath: string;
}): JSX.Element {
  return (
    <div class="quickmenu-wrapper">
      <div class="quickmenu">
        <Tooltip tooltip="Zur Übersicht">
          <RouterLink href={props.parentPath} class="button-link">
            <Button label={<Icon icon="backward" />} />
          </RouterLink>
        </Tooltip>
        <Tooltip tooltip="Zum Programm">
          <RouterLink href="/programm" class="button-link">
            <Button label={<Icon icon="dice-d20" />} />
          </RouterLink>
        </Tooltip>
        <Show when={props.roles$.get().includes("editor")}>
          <Tooltip tooltip="Zu deinen Spielrunden">
            <RouterLink href="/erstellen" class="button-link">
              <Button label={<Icon icon="grid-2-plus" />} />
            </RouterLink>
          </Tooltip>
        </Show>
        <Tooltip tooltip="Zur Wunschliste">
          <RouterLink href="/wunschliste" class="button-link">
            <Button label={<Icon icon="message-pen" />} />
          </RouterLink>
        </Tooltip>
        <Tooltip tooltip="Zur Zusammenfassung">
          <RouterLink href="/zusammenfassung" class="button-link">
            <Button label={<Icon icon="list" />} />
          </RouterLink>
        </Tooltip>
      </div>
    </div>
  );
}

export function QuickMenuExtended(props: {
  roles$: Reactive<Roles>;
  saveState$: Reactive<SaveState>;
  lastSaved$: Reactive<Date>;
  parentPath: string;
}): JSX.Element {
  return (
    <>
      <Box type="gray">
        <div class="quickmenu extended">
          <RouterLink href={props.parentPath} class="button-link">
            <ButtonWithIcon icon="backward" label="Zur Übersicht" />
          </RouterLink>
          <RouterLink href="/programm" class="button-link">
            <ButtonWithIcon icon="dice-d20" label="Zum Programm" />
          </RouterLink>
          <Show when={props.roles$.get().includes("editor")}>
            <RouterLink href="/erstellen" class="button-link">
              <ButtonWithIcon
                icon="grid-2-plus"
                label="Zu deinen Spielrunden"
              />
            </RouterLink>
          </Show>
          <RouterLink href="/wunschliste" class="button-link">
            <ButtonWithIcon icon="message-pen" label="Zur Wunschliste" />
          </RouterLink>
          <RouterLink href="/zusammenfassung" class="button-link">
            <ButtonWithIcon icon="list" label="Zur Zusammenfassung" />
          </RouterLink>
        </div>
      </Box>
      <SaveStateDisplay
        saveState$={props.saveState$}
        lastSaved$={props.lastSaved$}
      />
    </>
  );
}

function SaveStateDisplay(props: {
  saveState$: Reactive<SaveState>;
  lastSaved$: Reactive<Date>;
}): JSX.Element {
  return (
    <Switch>
      <Match when={props.saveState$.get() === "IDLE"}>
        <div style="margin-block-start: 1rem; display: flex; gap: 0.5rem; align-items: center;">
          <Icon icon="circle-check" />
          <em>
            Zuletzt gespeichert um: {formatDateTime(props.lastSaved$.get())} Uhr
          </em>
        </div>
      </Match>
      <Match when={props.saveState$.get() === "SAVING"}>
        <div style="margin-block-start: 1rem; display: flex; gap: 0.5rem; align-items: center;">
          <Icon icon="floppy-disk-circle-arrow-right" />
          <em>Am Speichern...</em>
        </div>
      </Match>
      <Match when={props.saveState$.get() === "ERROR"}>
        <div style="margin-block-start: 1rem; display: flex; gap: 0.5rem; align-items: center;">
          <Icon icon="triangle-exclamation" />
          <em>Speichern war nicht möglich!</em>
        </div>
      </Match>
    </Switch>
  );
}
