import { Box } from "@common/components/Box";
import { Button } from "@common/components/Button";
import type { ProgramDay } from "@common/utils/time";
import { Show, type Accessor, type JSX, type Setter } from "solid-js";

export type DayFilterState = ProgramDay | null;

export function DayFilter(props: {
  dayFilter: Accessor<DayFilterState>;
  setDayFilter: Setter<DayFilterState>;
  exclude?: ProgramDay[];
}): JSX.Element {
  const exclude = props.exclude ?? [];

  return (
    <Box>
      <div style="display: flex; flex-wrap: wrap; gap: 1rem; justify-content: space-between;">
        <h5 style="margin: 0;">Filter</h5>
      </div>
      <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
        <Button
          label="Alle Tage"
          kind={props.dayFilter() === null ? "success" : "gray"}
          onClick={() => props.setDayFilter(null)}
        />
        <Show when={!exclude.includes("FRIDAY")}>
          <Button
            label="Freitag"
            kind={props.dayFilter() === "FRIDAY" ? "success" : "gray"}
            onClick={() => props.setDayFilter("FRIDAY")}
          />
        </Show>
        <Show when={!exclude.includes("SATURDAY")}>
          <Button
            label="Samstag"
            kind={props.dayFilter() === "SATURDAY" ? "success" : "gray"}
            onClick={() => props.setDayFilter("SATURDAY")}
          />
        </Show>
        <Show when={!exclude.includes("SUNDAY")}>
          <Button
            label="Sonntag"
            kind={props.dayFilter() === "SUNDAY" ? "success" : "gray"}
            onClick={() => props.setDayFilter("SUNDAY")}
          />
        </Show>
      </div>
    </Box>
  );
}
