import { Icon } from "@common/components/Icon";
import type { JSX } from "solid-js";

export function LoadingOverlay(): JSX.Element {
  return (
    <div class="loading-backdrop">
      <Icon icon="spinner" rotating />
    </div>
  );
}
