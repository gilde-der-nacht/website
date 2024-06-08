import type { JSX } from "solid-js";
import {
  getByDayAndHour,
  type Program,
  type ReservationFromServer,
  type UpdateSave,
} from "./data";
import { Box } from "@common/components/Box";
import { ProgramOfDay } from "./Program";
import type { Reservation, ReservationView } from "./store";

export function Sonntag(props: {
  selfName: string;
  program: Program | null;
  wantsEmailUpdates: boolean;
  confirmedReservations: ReservationFromServer[];
  tentativeReservations: Reservation[];
  addTentativeReservation: (reservation: Reservation) => void;
  updateSave: UpdateSave;
  deleteReservation: (reservation: ReservationView) => void;
}): JSX.Element {
  if (props.program === null) {
    return (
      <>
        <h2>Programm Sonntag</h2>
        <Box>Programm wird geladen ...</Box>
      </>
    );
  }
  const sundayByHour = getByDayAndHour("SUNDAY", props.program);
  return (
    <>
      <h2>Programm Sonntag</h2>
      <ProgramOfDay
        selfName={props.selfName}
        programByHour={sundayByHour}
        confirmedReservations={props.confirmedReservations}
        tentativeReservations={props.tentativeReservations}
        wantsEmailUpdates={props.wantsEmailUpdates}
        addTentativeReservation={props.addTentativeReservation}
        updateSave={props.updateSave}
        deleteReservation={props.deleteReservation}
      />
    </>
  );
}
