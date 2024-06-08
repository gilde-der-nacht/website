import {
  getByDayAndHour,
  type Program,
  type ReservationFromServer,
  type UpdateSave,
} from "./data";
import { Box } from "@common/components/Box";
import type { JSX } from "solid-js";
import { ProgramOfDay } from "./Program";
import type { Reservation, ReservationView } from "./store";

export function Samstag(props: {
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
        <h2>Programm Samstag</h2>
        <Box>Programm wird geladen ...</Box>
      </>
    );
  }
  const saturdayByHour = getByDayAndHour("SATURDAY", props.program);
  return (
    <>
      <h2>Programm Samstag</h2>
      <ProgramOfDay
        selfName={props.selfName}
        programByHour={saturdayByHour}
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
