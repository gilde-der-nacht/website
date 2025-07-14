import API from "@hhh/components/webapp/api/api";
import { NewOrderPage } from "@hhh/components/webapp/pages/NewOrderPage";
import { NewRestaurantPage } from "@hhh/components/webapp/pages/NewRestaurantPage";
import { StartPage } from "@hhh/components/webapp/pages/StartPage";
import type { AppData, AppState } from "@hhh/components/webapp/util/StateTypes";
import type { Accessor, JSX, Setter } from "solid-js";

export type PageType = "start" | "newOrder" | "newRestaurant";

export type PageProps = {
  data: AppData;
  stateSignal: [Accessor<AppState>, Setter<AppState>];
  API: ReturnType<typeof API>;
};

export const Router: Record<PageType, (props: PageProps) => () => JSX.Element> =
  {
    start: (props) => () => <StartPage {...props} />,
    newOrder: (props) => () => <NewOrderPage {...props} />,
    newRestaurant: (props) => () => <NewRestaurantPage {...props} />,
  };
