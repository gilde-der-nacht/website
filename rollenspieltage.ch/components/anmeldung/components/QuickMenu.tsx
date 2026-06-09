import { Button, ButtonWithIcon } from "@common/components/Button";
import { Icon } from "@common/components/Icon";
import { Tooltip } from "@common/components/Tooltip";
import type { JSX } from "solid-js/jsx-runtime";
import type { Roles, SaveState } from "@rst/components/anmeldung/api/meta";
import { Match, Show, Switch } from "solid-js";
import { Box } from "@common/components/Box";
import { formatDateTime } from "@common/components/utils";
import { Link } from "@common/components/Link";

export function QuickMenu(props: {
  roles: Roles;
  saveState: SaveState;
  lastSaved: Date;
  parentPath: string;
}): JSX.Element {
  return (
    <div class="quickmenu-wrapper">
      <div class="quickmenu">
        <Tooltip tooltip="Zur Übersicht">
          <Link href={props.parentPath} class="button-link">
            <Button label={<Icon icon="backward" />} />
          </Link>
        </Tooltip>
        <Tooltip tooltip="Zum Programm">
          <Link href="/programm" class="button-link">
            <Button label={<Icon icon="dice-d20" />} />
          </Link>
        </Tooltip>
        <Show when={props.roles.includes("editor")}>
          <Tooltip tooltip="Zu deinen Spielrunden">
            <Link href="/erstellen" class="button-link">
              <Button label={<Icon icon="grid-2-plus" />} />
            </Link>
          </Tooltip>
        </Show>
        <Show when={false}>
          <Tooltip tooltip="Zum Helferplan">
            <Link href="/helfen" class="button-link">
              <Button label={<Icon icon="hand-heart" />} />
            </Link>
          </Tooltip>
        </Show>
        <Tooltip tooltip="Zur Zusammenfassung">
          <Link href="/zusammenfassung" class="button-link">
            <Button label={<Icon icon="list" />} />
          </Link>
        </Tooltip>
      </div>
    </div>
  );
}

export function QuickMenuExtended(props: {
  roles: Roles;
  saveState: SaveState;
  lastSaved: Date;
  parentPath: string;
}): JSX.Element {
  return (
    <>
      <Box type="gray">
        <div class="quickmenu extended">
          <Link href={props.parentPath} class="button-link">
            <ButtonWithIcon icon="backward" label="Zur Übersicht" />
          </Link>
          <Link href="/programm" class="button-link">
            <ButtonWithIcon icon="dice-d20" label="Zum Programm" />
          </Link>
          <Show when={props.roles.includes("editor")}>
            <Link href="/erstellen" class="button-link">
              <ButtonWithIcon
                icon="grid-2-plus"
                label="Zu deinen Spielrunden"
              />
            </Link>
          </Show>

          <Show when={false}>
            <Link href="/helfen" class="button-link">
              <ButtonWithIcon icon="hand-heart" label="Zum Helferplan" />
            </Link>
          </Show>
          <Link href="/zusammenfassung" class="button-link">
            <ButtonWithIcon icon="list" label="Zur Zusammenfassung" />
          </Link>
        </div>
      </Box>
      <SaveStateDisplay
        saveState={props.saveState}
        lastSaved={props.lastSaved}
      />
    </>
  );
}

function SaveStateDisplay(props: {
  saveState: SaveState;
  lastSaved: Date;
}): JSX.Element {
  return (
    <Switch>
      <Match when={props.saveState === "IDLE"}>
        <div style="margin-block-start: 1rem; display: flex; gap: 0.5rem; align-items: center;">
          <Icon icon="circle-check" />
          <em>Zuletzt gespeichert um: {formatDateTime(props.lastSaved)} Uhr</em>
        </div>
      </Match>
      <Match when={props.saveState === "SAVING"}>
        <div style="margin-block-start: 1rem; display: flex; gap: 0.5rem; align-items: center;">
          <Icon icon="floppy-disk-circle-arrow-right" />
          <em>Am Speichern...</em>
        </div>
      </Match>
      <Match when={props.saveState === "ERROR"}>
        <div style="margin-block-start: 1rem; display: flex; gap: 0.5rem; align-items: center;">
          <Icon icon="triangle-exclamation" />
          <em>Speichern war nicht möglich!</em>
        </div>
      </Match>
    </Switch>
  );
}
