import { Box } from "@common/components/Box";
import type { JSX } from "solid-js";

export type Props = {
  time: {
    from: number;
    to: number;
  };
  type: "LUNCH" | "DINNER";
};

export function MealBreak(props: Props): JSX.Element {
  return (
    <Box>
      <small>
        {props.time.from} - {props.time.to} Uhr
      </small>
      <h4 style="margin-block-end: 0.5rem;">
        {props.type === "LUNCH" ? "Mittagessen" : "Nachtessen"}
      </h4>
      <p>
        Wir kochen: Pilzrisotto (vegan / vegi), Penne All'Arrabbiata und Penne
        Pesto (vegan / vegi).
      </p>
    </Box>
  );
}
