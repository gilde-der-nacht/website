import { Box } from "@common/components/Box";
import type { JSX } from "solid-js";

export type Props = {
  from: number;
  to: number;
  title: "Mittagessen" | "Nachtessen";
  small?: boolean;
};

export function MealBreak(props: Props): JSX.Element {
  const small = props.small === true;
  const menu = "Das Menü wird zu einem späteren Zeitpunkt kommuniziert."; //"Pilzrisotto (vegi&nbsp;/&nbsp;vegan), Penne All'Arrabbiata und Penne Pesto (vegi&nbsp;/&nbsp;vegan).";

  if (small) {
    return (
      <Box>
        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center;">
          <p>
            <strong>{props.title}</strong>
          </p>
          |
          <small>
            {props.from} bis {props.to} Uhr
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
        {props.from} - {props.to} Uhr
      </small>
      <h4 style="margin-block-end: 0.5rem;">{props.title}</h4>
      <em>Das Menü wird zu einem späteren Zeitpunkt kommuniziert.</em>
      {
        // <p>
        //   Wir kochen: <span innerHTML={menu}></span>
        // </p>
      }
    </Box>
  );
}
