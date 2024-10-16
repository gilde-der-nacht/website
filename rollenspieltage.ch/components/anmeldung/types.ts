import type { Tab } from "@rst/components/anmeldung/Tabs";
import type { SaveFromServer } from "@rst/components/anmeldung/data";

export type DayPeriod = "MORNING" | "AFTERNOON" | "EVENING";

export type Reservation = {
  gameUuid: string;
  friendsName: string | null;
};

export type ReservationView =
  | {
      confirmed: false;
      gameUuid: string;
      name: string;
    }
  | {
      confirmed: true;
      gameUuid: string;
      name: string;
      reservationId: number;
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
  markedForDeletionReservations: number[];
};

export type Range = {
  from: number;
  to: number;
};

export type ReservedTimeRange = {
  range: Range;
  gameUuid: string;
};
