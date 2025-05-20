import {
  saveSchema,
  type Save,
} from "@rst/components/anmeldung/state/save-client";
import {
  saveServerSchema,
  type SaveServer,
} from "@rst/components/anmeldung/state/save-server";
import type { Result } from "@rst/components/anmeldung/api/utils";
import { mockedLoadSave } from "@rst/components/anmeldung/api/mock";

export async function loadSave(secret: string): Promise<Result<Save>> {
  if (secret !== "demo") {
    return {
      success: false,
    };
  }

  const save = await mockedLoadSave();
  const parseResult = saveServerSchema.safeParse(save);

  if (!parseResult.success) {
    return {
      success: false,
    };
  }
  const transformResult = transformSaveFromServer(parseResult.data);
  if (!transformResult.success) {
    return {
      success: false,
    };
  }

  return {
    success: true,
    data: transformResult.data,
  };
}

function transformSaveFromServer(s: SaveServer): Result<Save> {
  return saveSchema.safeParse(s);
}
