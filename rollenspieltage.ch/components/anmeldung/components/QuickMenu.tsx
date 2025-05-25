import { Button, ButtonWithIcon } from "@common/components/Button";
import { Icon } from "@common/components/Icon";
import { Tooltip } from "@common/components/Tooltip";
import type { JSX } from "solid-js/jsx-runtime";
import type { ChangePageFn } from "@rst/components/anmeldung/Router";
import type { SaveState } from "@rst/components/anmeldung/api/meta";
import { Match, Switch } from "solid-js";
import { formatDateTime } from "@common/components/utils";

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
        <Switch>
          <Match when={props.saveState === "IDLE"}>
            <Tooltip
              tooltip={`Zuletzt gespeichert um: ${formatDateTime(props.lastSaved)} Uhr`}
            >
              <Button label={<Icon icon="circle-check" />} kind="gray" />
            </Tooltip>
          </Match>
          <Match when={props.saveState === "SAVING"}>
            <Tooltip tooltip="Am Speichern...">
              <Button
                label={<Icon icon="floppy-disk-circle-arrow-right" />}
                kind="success"
              />
            </Tooltip>
          </Match>
          <Match when={props.saveState === "ERROR"}>
            <Tooltip tooltip="Speichern war nicht möglich!">
              <Button
                label={<Icon icon="triangle-exclamation" />}
                kind="danger"
              />
            </Tooltip>
          </Match>
        </Switch>
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
      <Switch>
        <Match when={props.saveState === "IDLE"}>
          <ButtonWithIcon
            icon="circle-check"
            label={`Zuletzt gespeichert um: ${formatDateTime(props.lastSaved)} Uhr`}
            kind="gray"
          />
        </Match>
        <Match when={props.saveState === "SAVING"}>
          <ButtonWithIcon
            icon="floppy-disk-circle-arrow-right"
            label="Am Speichern..."
            kind="success"
          />
        </Match>
        <Match when={props.saveState === "ERROR"}>
          <ButtonWithIcon
            icon="triangle-exclamation"
            label="Speichern war nicht möglich!"
            kind="danger"
          />
        </Match>
      </Switch>
    </div>
  );
}
