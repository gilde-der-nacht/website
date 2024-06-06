import { getByDayAndHour, type Program } from "./data";
import { Box } from "@common/components/Box";
import type { JSX } from "solid-js";
import { ProgramOfDay } from "./Program";
import type { Reservation } from "./store";

export function Samstag(props: {
  program: Program | null;
  addTentativeReservation: (reservation: Reservation) => void;
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
        addTentativeReservation={props.addTentativeReservation}
      />
    </>
  );
}
