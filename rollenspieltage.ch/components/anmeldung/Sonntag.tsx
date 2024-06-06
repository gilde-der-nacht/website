import type { JSX } from "solid-js";
import { getByDayAndHour, type Program } from "./data";
import { Box } from "@common/components/Box";
import { ProgramOfDay } from "./Program";
import type { Reservation } from "./store";

export function Sonntag(props: {
  program: Program | null;
  addTentativeReservation: (reservation: Reservation) => void;
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
        programByHour={sundayByHour}
        addTentativeReservation={props.addTentativeReservation}
      />
    </>
  );
}
