import { Box } from "@common/components/Box";
import type { JSX } from "solid-js";

export type Props = {
  type: "LUNCH" | "DINNER";
  small?: boolean;
};

export function MealBreak(props: Props): JSX.Element {
  const from = props.type === "LUNCH" ? 13 : 18;
  const to = props.type === "LUNCH" ? 14 : 19;
  const small = props.small === true;

  if (small) {
    return (
      <Box>
        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center;">
          <p>
            <strong>
              {props.type === "LUNCH" ? "Mittagessen" : "Nachtessen"}
            </strong>
          </p>
          |
          <small>
            {from} bis {to} Uhr
          </small>
        </div>
        <p>
          <small>
            Pilzrisotto (vegan&nbsp;/&nbsp;vegi), Penne All'Arrabbiata und Penne
            Pesto (vegan&nbsp;/&nbsp;vegi).
          </small>
        </p>
      </Box>
    );
  }

  return (
    <Box>
      <small>
        {from} - {to} Uhr
      </small>
      <h4 style="margin-block-end: 0.5rem;">
        {props.type === "LUNCH" ? "Mittagessen" : "Nachtessen"}
      </h4>
      <p>
        Wir kochen: Pilzrisotto (vegan&nbsp;/&nbsp;vegi), Penne All'Arrabbiata
        und Penne Pesto (vegan&nbsp;/&nbsp;vegi).
      </p>
    </Box>
  );
}
