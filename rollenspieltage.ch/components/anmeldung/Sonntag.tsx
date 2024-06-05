import type { JSX } from "solid-js";
import { getByDayAndHour, type Program } from "./data";
import { Box } from "@common/components/Box";
import { ProgramOfDay } from "./Program";

export function Sonntag(props: { program: Program | null }): JSX.Element {
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
      <ProgramOfDay programByHour={sundayByHour} />
    </>
  );
}
