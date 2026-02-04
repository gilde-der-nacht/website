import { Button, ButtonWithIcon } from "@common/components/Button";
import { Icon } from "@common/components/Icon";
import { Tooltip } from "@common/components/Tooltip";
import type { JSX } from "solid-js/jsx-runtime";
import type { Roles, SaveState } from "@lst/components/anmeldung/api/meta";
import { Match, Show, Switch } from "solid-js";
import { Box } from "@common/components/Box";
import { formatDateTime } from "@common/components/utils";
import { A } from "@solidjs/router";

export function QuickMenu(props: {
  roles: Roles;
  link: (path: string) => string;
  saveState: SaveState;
  lastSaved: Date;
  parentPath: string;
}): JSX.Element {
  return (
    <div class="quickmenu-wrapper">
      <div class="quickmenu">
        <Tooltip tooltip="Zur Übersicht">
          <A href={props.link(props.parentPath)} class="button-link">
            <Button label={<Icon icon="backward" />} />
          </A>
        </Tooltip>
        <Show when={props.roles.includes("admin")}>
          <Tooltip tooltip="Zum Programm">
            <A href={props.link("/programm")} class="button-link">
              <Button label={<Icon icon="dice-d20" />} />
            </A>
          </Tooltip>
          <Tooltip tooltip="Zu deinen Programmpunkten">
            <A href={props.link("/erstellen")} class="button-link">
              <Button label={<Icon icon="grid-2-plus" />} />
            </A>
          </Tooltip>
        </Show>
        <Tooltip tooltip="Zum Helferplan">
          <A href={props.link("/helfen")} class="button-link">
            <Button label={<Icon icon="hand-heart" />} />
          </A>
        </Tooltip>
        <Tooltip tooltip="Zur Zusammenfassung">
          <A href={props.link("/zusammenfassung")} class="button-link">
            <Button label={<Icon icon="list" />} />
          </A>
        </Tooltip>
      </div>
    </div>
  );
}

export function QuickMenuExtended(props: {
  roles: Roles;
  link: (path: string) => string;
  saveState: SaveState;
  lastSaved: Date;
  parentPath: string;
}): JSX.Element {
  return (
    <>
      <Box type="gray">
        <div class="quickmenu extended">
          <A href={props.link(props.parentPath)} class="button-link">
            <ButtonWithIcon icon="backward" label="Zur Übersicht" />
          </A>
          <Show when={props.roles.includes("admin")}>
            <A href={props.link("/programm")} class="button-link">
              <ButtonWithIcon icon="dice-d20" label="Zum Programm" />
            </A>
            <A href={props.link("/erstellen")} class="button-link">
              <ButtonWithIcon
                icon="grid-2-plus"
                label="Zu deinen Programmpunkten"
              />
            </A>
          </Show>
          <A href={props.link("/helfen")} class="button-link">
            <ButtonWithIcon icon="hand-heart" label="Zum Helferplan" />
          </A>
          <A href={props.link("/zusammenfassung")} class="button-link">
            <ButtonWithIcon icon="list" label="Zur Zusammenfassung" />
          </A>
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
