import type { JSX } from "solid-js";

export const Progress = (): JSX.Element => (
  <progress class="progress is-dark" max="100">
    loading
  </progress>
);
