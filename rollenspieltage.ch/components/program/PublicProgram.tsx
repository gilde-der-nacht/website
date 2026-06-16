import { HydrationHelper } from "@common/components/HydrationHelper";
import type { JSX } from "solid-js";
import { loadProgram } from "@rst/components/anmeldung/api/program";
import { assert } from "@common/components/utils";
import { PublicProgramm as Program } from "@rst/components/anmeldung/pages/Programm";

export function PublicProgram(): JSX.Element {
  return (
    <HydrationHelper
      strategy={{
        kind: "CLIENT_REFRESH",
        showLoading: false,
        showOutdatedData: true,
      }}
      fetcher={() => loadProgram(null)}
    >
      {(result, FeedbackBox) => {
        assert(result.kind === "SUCCESS", "");

        return (
          <>
            <FeedbackBox />
            <Program programData={() => result.data} />
          </>
        );
      }}
    </HydrationHelper>
  );
}
