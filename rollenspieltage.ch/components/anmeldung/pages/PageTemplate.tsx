import type { WithChildren } from "@common/components/utils";
import type { JSX } from "solid-js/jsx-runtime";
import { QuickMenu, QuickMenuExtended } from "../components/QuickMenu";
import type { PageMeta } from "../load";

export function PageTemplate(
  props: WithChildren & {
    title: string;
    showQuickmenu?: boolean;
    changePage: (pageMeta: PageMeta) => void;
  },
): JSX.Element {
  return (
    <div class="page">
      {props.showQuickmenu !== false ? (
        <QuickMenu changePage={props.changePage} />
      ) : null}
      <div class="page-content">
        <h2>{props.title}</h2>
        <br />
        {props.children}
      </div>
      {props.showQuickmenu !== false ? (
        <QuickMenuExtended changePage={props.changePage} />
      ) : null}
    </div>
  );
}
