import { Button, ButtonWithIcon } from "@common/components/Button";
import { Icon } from "@common/components/Icon";
import { Tooltip } from "@common/components/Tooltip";
import type { JSX } from "solid-js/jsx-runtime";
import type { ChangePageFn } from "@rst/components/anmeldung/Router";
import type { SaveState } from "@rst/components/anmeldung/api/meta";
import { Match, Switch } from "solid-js";
import { formatDateTime } from "@common/components/utils";
import { Box } from "@common/components/Box";

export function QuickMenu(props: {
  changePage: ChangePageFn;
  saveState: SaveState;
  lastSaved: Date;
}): JSX.Element {
  return (
    <div class="quickmenu-wrapper">
      <div class="quickmenu">
        <Tooltip tooltip="Zur Übersicht">
          <Button
            label={<Icon icon="backward" />}
            onClick={() => props.changePage({ kind: "CHOOSE" })}
          />
        </Tooltip>
        <Tooltip tooltip="Zu den Spielrunden">
          <Button
            label={<Icon icon="dice-d20" />}
            onClick={() => props.changePage({ kind: "PLAYER" })}
          />
        </Tooltip>
        <Tooltip tooltip="Zu deinen Spielrunden">
          <Button
            label={<Icon icon="grid-2-plus" />}
            onClick={() => props.changePage({ kind: "GAMEMASTER" })}
          />
        </Tooltip>
        <Tooltip tooltip="Zum Helferplan">
          <Button
            label={<Icon icon="hand-heart" />}
            onClick={() => props.changePage({ kind: "HELPING" })}
          />
        </Tooltip>
        <Tooltip tooltip="Zur Zusammenfassung">
          <Button
            label={<Icon icon="list" />}
            onClick={() => props.changePage({ kind: "SUMMARY" })}
          />
        </Tooltip>
      </div>
    </div>
  );
}

export function QuickMenuExtended(props: {
  changePage: ChangePageFn;
  saveState: SaveState;
  lastSaved: Date;
}): JSX.Element {
  return (
    <>
      <Box type="gray">
        <div class="quickmenu extended">
          <ButtonWithIcon
            icon="backward"
            label="Zur Übersicht"
            onClick={() => props.changePage({ kind: "CHOOSE" })}
          />
          <ButtonWithIcon
            icon="dice-d20"
            label="Zu den Spielrunden"
            onClick={() => props.changePage({ kind: "PLAYER" })}
          />
          <ButtonWithIcon
            icon="grid-2-plus"
            label="Zu deinen Spielrunden"
            onClick={() => props.changePage({ kind: "GAMEMASTER" })}
          />
          <ButtonWithIcon
            icon="hand-heart"
            label="Zum Helferplan"
            onClick={() => props.changePage({ kind: "HELPING" })}
          />
          <ButtonWithIcon
            icon="list"
            label="Zur Zusammenfassung"
            onClick={() => props.changePage({ kind: "SUMMARY" })}
          />
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
