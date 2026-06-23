import { Box, type BoxType } from "@common/components/Box";
import { Icon, type IconType } from "@common/components/Icon";
import type { WithChildren } from "@common/components/utils";
import type { JSX } from "solid-js";

export function BoxLink(
  props: WithChildren<{
    icon: IconType;
    type?: BoxType;
    onClick?: (() => void) | undefined | "DISABLED";
  }>,
): JSX.Element {
  const type = props.type ?? "special";

  return (
    <div class="boxLink">
      <Box
        type={type}
        onClick={props.onClick === "DISABLED" ? undefined : props.onClick}
        style={props.onClick === "DISABLED" ? "cursor: not-allowed ;" : ""}
      >
        <div class="grid">
          <Icon icon={props.icon} />
          <div>{props.children}</div>
        </div>
      </Box>
    </div>
  );
}
