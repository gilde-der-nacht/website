import { Button } from "@common/components/Button";
import { Icon } from "@common/components/Icon";
import { Tooltip } from "@common/components/Tooltip";
import type { JSX } from "solid-js/jsx-runtime";
import type { ChangePageFn } from "@rst/components/anmeldung/Router";

export function QuickMenu(props: { changePage: ChangePageFn }): JSX.Element {
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
}): JSX.Element {
  return (
    <div class="quickmenu extended">
      <Button
        label={
          <div class="grid">
            <Icon icon="backward" />
            <span>Zur Übersicht</span>
          </div>
        }
        onClick={() => props.changePage({ kind: "CHOOSE" })}
      />
      <Button
        label={
          <div class="grid">
            <Icon icon="dice-d20" />
            <span>Zu den Spielrunden</span>
          </div>
        }
        onClick={() => props.changePage({ kind: "PLAYER" })}
      />
      <Button
        label={
          <div class="grid">
            <Icon icon="grid-2-plus" />
            <span>Zu deinen Spielrunden</span>
          </div>
        }
        onClick={() => props.changePage({ kind: "GAMEMASTER" })}
      />
      <Button
        label={
          <div class="grid">
            <Icon icon="hand-heart" />
            <span>Zum Helferplan</span>
          </div>
        }
        onClick={() => props.changePage({ kind: "HELPING" })}
      />
      <Button
        label={
          <div class="grid">
            <Icon icon="list" />
            <span>Zur Zusammenfassung</span>
          </div>
        }
        onClick={() => props.changePage({ kind: "SUMMARY" })}
      />
    </div>
  );
}
