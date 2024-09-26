import { EntryListItem } from "@hhh/components/webapp/components/entry/EntryListItem";
import { Button } from "@hhh/components/webapp/components/static/Button";
import { Icon } from "@hhh/components/webapp/components/static/icons/Icon";
import { Notification } from "@hhh/components/webapp/components/static/Notification";
import type {
  AppState,
  EntryState,
} from "@hhh/components/webapp/util/StateTypes";
import { setShowEntryList } from "@hhh/components/webapp/util/utils";
import { type Accessor, For, type JSX, type Setter, Show } from "solid-js";

type Props = {
  activeEntries: readonly EntryState[];
  inactiveEntries: readonly EntryState[];
  deactivateEntry: (entry: EntryState) => void;
  reactivateEntry: (entry: EntryState) => void;
  removeEntry: (entry: EntryState) => void;
  stateSignal: [Accessor<AppState>, Setter<AppState>];
};

export const EntryList = (props: Props): JSX.Element => {
  const [state, setState] = props.stateSignal;

  return (
    <>
      <Show
        when={props.activeEntries.length > 0}
        fallback={
          <Notification kind="info">
            <div class="is-flex is-flex-wrap-wrap is-justify-content-space-between is-align-items-center">
              <p>
                <em>Keine aktiven Einträge gefungen.</em>
              </p>
            </div>
          </Notification>
        }
      >
        <div class="hhh-spacer" style="--gap: 1rem;">
          <For each={props.activeEntries}>
            {(entry) => (
              <EntryListItem isDisabled={false} entry={entry}>
                <Button
                  title="Eintrag deaktivieren"
                  color="danger"
                  onClick={() => props.deactivateEntry(entry)}
                >
                  <Icon icon="circle-stop" />
                </Button>
              </EntryListItem>
            )}
          </For>
        </div>
      </Show>
      <Show when={props.inactiveEntries.length > 0}>
        <Show
          when={state().showEntryList}
          fallback={
            <Button onClick={() => setShowEntryList(setState)(true)}>
              Zeige deaktivierte Einträge
            </Button>
          }
        >
          <For each={props.inactiveEntries}>
            {(entry) => (
              <EntryListItem isDisabled={true} entry={entry}>
                <div class="buttons has-addons">
                  <Button
                    title="Eintrag reaktivieren"
                    color="success"
                    onClick={() => props.reactivateEntry(entry)}
                  >
                    <Icon icon="circle-play" />
                  </Button>
                  <Button
                    title="Eintrag löschen"
                    color="danger"
                    onClick={() => props.removeEntry(entry)}
                  >
                    <Icon icon="trash" />
                  </Button>
                </div>
              </EntryListItem>
            )}
          </For>
        </Show>
      </Show>
    </>
  );
};
