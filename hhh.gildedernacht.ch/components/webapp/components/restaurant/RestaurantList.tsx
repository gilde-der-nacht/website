import { RestaurantListItem } from "@hhh/components/webapp/components/restaurant/RestaurantListItem";
import { Button } from "@hhh/components/webapp/components/static/Button";
import { Icon } from "@hhh/components/webapp/components/static/icons/Icon";
import { Notification } from "@hhh/components/webapp/components/static/Notification";
import type { RestaurantState } from "@hhh/components/webapp/util/StateTypes";
import { For, type JSX, Show } from "solid-js";

type Props = {
  activeRestaurants: readonly RestaurantState[];
  inactiveRestaurants: readonly RestaurantState[];
  deactivateRestaurant: (restaurant: RestaurantState) => void;
  reactivateRestaurant: (restaurant: RestaurantState) => void;
  removeRestaurant: (restaurant: RestaurantState) => void;
  showList: boolean;
  setShowList: (b: boolean) => void;
};

export const RestaurantList = (props: Props): JSX.Element => {
  return (
    <Show
      when={props.showList}
      fallback={
        <Button onClick={() => props.setShowList(true)}>
          Zeige Liste der Restaurants
        </Button>
      }
    >
      <div>
        <h3 class="title is-3 has-text-centered">Restaurant Liste</h3>
        <Show
          when={
            props.activeRestaurants.length === 0 &&
            props.inactiveRestaurants.length === 0
          }
        >
          <Notification kind="info">
            <em>Keine (aktiven oder inaktiven) Restaurants gefunden.</em>
          </Notification>
        </Show>
        <div class="hhh-spacer" style="--gap: 1rem;">
          <For each={props.activeRestaurants}>
            {(restaurant) => (
              <RestaurantListItem isDisabled={false} restaurant={restaurant}>
                <Button
                  title="Restaurant deaktivieren"
                  color="danger"
                  onClick={() => props.deactivateRestaurant(restaurant)}
                >
                  <Icon icon="circle-stop" />
                </Button>
              </RestaurantListItem>
            )}
          </For>
          <For each={props.inactiveRestaurants}>
            {(restaurant) => (
              <RestaurantListItem isDisabled={true} restaurant={restaurant}>
                <div class="buttons has-addons">
                  <Button
                    title="Restaurant reaktivieren"
                    color="success"
                    onClick={() => props.reactivateRestaurant(restaurant)}
                  >
                    <Icon icon="circle-play" />
                  </Button>
                  <Button
                    title="Restaurant löschen"
                    color="danger"
                    onClick={() => props.removeRestaurant(restaurant)}
                  >
                    <Icon icon="trash" />
                  </Button>
                </div>
              </RestaurantListItem>
            )}
          </For>
        </div>
      </div>
    </Show>
  );
};
