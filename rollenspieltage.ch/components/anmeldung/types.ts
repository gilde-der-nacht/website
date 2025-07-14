import type { SaveFromServer } from "@rst/components/anmeldung/data";
import type { Tab } from "@rst/components/anmeldung/Tabs";
import type { TimeRange } from "./utils/time";

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

export type AppState = {
  state: "IDLE" | "SAVING";
  secret: string;
  showCreateMessage: boolean;
  currentSave: SaveFromServer;

  // old state
  activeTab: Tab;
  lastSaved: string;
  hasChanged: boolean;
  tentativeReservations: Reservation[];
  markedForDeletionReservations: number[];
};

export type ReservedTimeRange = {
  range: TimeRange;
  gameUuid: string;
};
