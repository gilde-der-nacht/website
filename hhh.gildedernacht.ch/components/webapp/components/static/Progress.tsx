import type { JSX } from "@solidjs/web";

export const Progress = (): JSX.Element => (
  <progress class="progress is-dark" max="100">
    loading
  </progress>
);
