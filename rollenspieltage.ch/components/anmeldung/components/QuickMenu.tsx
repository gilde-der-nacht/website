import { Button } from "@common/components/Button";
import { Icon } from "@common/components/Icon";
import { Tooltip } from "@common/components/Tooltip";
import type { JSX } from "solid-js/jsx-runtime";
import type { Page } from "../load";

export function QuickMenu(props: {
  changePage: (page: Page) => void;
}): JSX.Element {
  return (
    <div class="quickmenu-wrapper">
      <div class="quickmenu">
        <Tooltip tooltip="Zur Übersicht">
          <Button
            label={<Icon icon="backward" />}
            onClick={() => props.changePage("CHOOSE")}
          />
        </Tooltip>
        <Tooltip tooltip="Zu den Spielrunden">
          <Button
            label={<Icon icon="dice-d20" />}
            onClick={() => props.changePage("PLAYER")}
          />
        </Tooltip>
        <Tooltip tooltip="Zu deinen Spielrunden">
          <Button
            label={<Icon icon="grid-2-plus" />}
            onClick={() => props.changePage("GAMEMASTER")}
          />
        </Tooltip>
        <Tooltip tooltip="Zum Helferplan">
          <Button
            label={<Icon icon="hand-heart" />}
            onClick={() => props.changePage("HELPING")}
          />
        </Tooltip>
        <Tooltip tooltip="Zur Zusammenfassung">
          <Button
            label={<Icon icon="list" />}
            onClick={() => props.changePage("SUMMARY")}
          />
        </Tooltip>
      </div>
    </div>
  );
}

export function QuickMenuExtended(props: {
  changePage: (page: Page) => void;
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
        onClick={() => props.changePage("CHOOSE")}
      />
      <Button
        label={
          <div class="grid">
            <Icon icon="dice-d20" />
            <span>Zu den Spielrunden</span>
          </div>
        }
        onClick={() => props.changePage("PLAYER")}
      />
      <Button
        label={
          <div class="grid">
            <Icon icon="grid-2-plus" />
            <span>Zu deinen Spielrunden</span>
          </div>
        }
        onClick={() => props.changePage("GAMEMASTER")}
      />
      <Button
        label={
          <div class="grid">
            <Icon icon="hand-heart" />
            <span>Zum Helferplan</span>
          </div>
        }
        onClick={() => props.changePage("HELPING")}
      />
      <Button
        label={
          <div class="grid">
            <Icon icon="list" />
            <span>Zur Zusammenfassung</span>
          </div>
        }
        onClick={() => props.changePage("SUMMARY")}
      />
    </div>
  );
}
