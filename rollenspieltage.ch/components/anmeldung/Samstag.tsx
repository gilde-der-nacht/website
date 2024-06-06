import { getByDayAndHour, type Program, type UpdateSave } from "./data";
import { Box } from "@common/components/Box";
import type { JSX } from "solid-js";
import { ProgramOfDay } from "./Program";
import type { Reservation } from "./store";

export function Samstag(props: {
  program: Program | null;
  wantsEmailUpdates: boolean;
  addTentativeReservation: (reservation: Reservation) => void;
  updateSave: UpdateSave;
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
        programByHour={saturdayByHour}
        wantsEmailUpdates={props.wantsEmailUpdates}
        addTentativeReservation={props.addTentativeReservation}
        updateSave={props.updateSave}
      />
    </>
  );
}
