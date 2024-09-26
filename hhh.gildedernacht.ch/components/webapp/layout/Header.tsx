import type { PageType } from "@hhh/components/webapp/pages/util/Router";
import type { JSX } from "solid-js";

type Props = {
  link: (page: PageType) => void;
};

export const Header = (props: Props): JSX.Element => {
  return (
    <header class="hero is-info is-small">
      <a onClick={() => props.link("start")}>
        <div class="hero-body">
          <h1 class="title is-2 has-text-centered">Hungry Hungry Hippos</h1>
          <h2 class="subtitle is-4 has-text-centered is-italic">
            Gilde der Nacht
          </h2>
        </div>
      </a>
    </header>
  );
};
