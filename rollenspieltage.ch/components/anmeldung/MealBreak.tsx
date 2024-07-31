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
  const title = props.type === "LUNCH" ? "Mittagessen" : "Nachtessen";
  const menu =
    "Pilzrisotto (vegi&nbsp;/&nbsp;vegan), Penne All'Arrabbiata und Penne Pesto (vegi&nbsp;/&nbsp;vegan).";

  if (small) {
    return (
      <Box>
        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center;">
          <p>
            <strong>{title}</strong>
          </p>
          |
          <small>
            {from} bis {to} Uhr
          </small>
        </div>
        <p>
          <small innerHTML={menu}></small>
        </p>
      </Box>
    );
  }

  return (
    <Box>
      <small>
        {from} - {to} Uhr
      </small>
      <h4 style="margin-block-end: 0.5rem;">{title}</h4>
      <p>
        Wir kochen: <span innerHTML={menu}></span>
      </p>
    </Box>
  );
}
