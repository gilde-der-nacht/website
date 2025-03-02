import type { Tab } from "@lst/components/anmeldung/Tabs";
import type { SaveFromServer } from "@lst/components/anmeldung/data";

export type DayPeriod = "MORNING" | "AFTERNOON" | "EVENING";

export type Reservation = {
  game_uuid: string;
  friends_name: string | null;
};

export type ReservationView =
  | {
      confirmed: false;
      game_uuid: string;
      name: string;
    }
  | {
      confirmed: true;
      game_uuid: string;
      name: string;
      reservation_uuid: string;
    };

export type Store = {
  state: "IDLE" | "SAVING";
  secret: string;
  showCreateMessage: boolean;
  currentSave: SaveFromServer;
  activeTab: Tab;
  lastSaved: string;
  hasChanged: boolean;
  tentativeReservations: Reservation[];
  markedForDeletionReservations: string[];
};

export type Range = {
  from: number;
  to: number;
};

export type ReservedTimeRange = {
  range: Range;
  game_uuid: string;
};
