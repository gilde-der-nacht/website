import { getByDayAndHour, type Program } from "./data";
import { Box } from "@common/components/Box";
import type { JSX } from "solid-js";
import { ProgramOfDay } from "./Program";

export function Samstag(props: { program: Program | null }): JSX.Element {
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
      <ProgramOfDay programByHour={saturdayByHour} />
    </>
  );
}
