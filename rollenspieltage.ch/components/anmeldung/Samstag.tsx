import {
  getByDayAndHour,
  type Program,
  type ReservationFromServer,
  type UpdateSave,
} from "./data";
import type { JSX } from "solid-js";
import { ProgramOfDay } from "./Program";
import type { Reservation, ReservationView } from "./types";

export function Samstag(props: {
  selfName: string;
  program: Program;
  wantsEmailUpdates: boolean;
  confirmedReservations: ReservationFromServer[];
  tentativeReservations: Reservation[];
  markedForDeletionReservations: number[];
  addTentativeReservation: (reservation: Reservation) => void;
  updateSave: UpdateSave;
  deleteReservation: (reservation: ReservationView) => void;
}): JSX.Element {
  const saturdayByHour = getByDayAndHour("SATURDAY", props.program);
  return (
    <ProgramOfDay
      selfName={props.selfName}
      programByHour={saturdayByHour}
      confirmedReservations={props.confirmedReservations}
      tentativeReservations={props.tentativeReservations}
      markedForDeletionReservations={props.markedForDeletionReservations}
      wantsEmailUpdates={props.wantsEmailUpdates}
      addTentativeReservation={props.addTentativeReservation}
      updateSave={props.updateSave}
      deleteReservation={props.deleteReservation}
    />
  );
}
