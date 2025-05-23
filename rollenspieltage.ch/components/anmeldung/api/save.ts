import type { ParseResult, Result } from "@rst/components/anmeldung/api/utils";
import { mockedLoadSave } from "@rst/components/anmeldung/api/mock";
import { z } from "astro/zod";
import {
  gameroundEditServerSchema,
  gameroundEditClientSchema,
  gameroundNewEditServerSchema,
  gameroundNewEditClientSchema,
} from "@rst/components/anmeldung/api/gameround-edit";

/*
 * Types
 */

/*
 * Playing
 */

const playingServerSchema = z.object({
  wantsUpdates: z.boolean(),
});

const playingClientSchema = z.object({
  wantsUpdates: z.boolean(),
});

/*
 * Master
 */

const masterServerSchema = z.object({
  games: z.array(gameroundEditServerSchema),
  newEditForm: gameroundNewEditServerSchema,
  wantsHelp: z.boolean(),
});

const masterClientSchema = z.object({
  games: z.array(gameroundEditClientSchema),
  newEditForm: gameroundNewEditClientSchema,
  wantsHelp: z.boolean(),
});
export type MasterClient = z.infer<typeof masterClientSchema>;

/*
 * Helping
 */

const helpingServerSchema = z.object({});

const helpingClientSchema = z.object({});

/*
 * Everything
 */

export const saveServerSchema = z.object({
  uuid: z.string().uuid(),
  name: z.string(),
  email: z.string(),
  mobile: z.string(),
  lastSaved: z.string(),
  playing: playingServerSchema,
  master: masterServerSchema,
  helping: helpingServerSchema,
});
export type SaveServer = z.infer<typeof saveServerSchema>;

export const saveClientSchema = z.object({
  uuid: z.string().uuid(),
  name: z.string(),
  email: z.string(),
  mobile: z.string(),
  lastSaved: z.coerce.date(),
  playing: playingClientSchema,
  master: masterClientSchema,
  helping: helpingClientSchema,
});

export type SaveClient = z.infer<typeof saveClientSchema>;

export async function loadSave(secret: string): Promise<Result<SaveClient>> {
  if (secret !== "demo") {
    return {
      kind: "FAILURE",
    };
  }

  const save = await mockedLoadSave();
  const parseResult = saveServerSchema.safeParse(save);

  if (!parseResult.success) {
    return {
      kind: "FAILURE",
    };
  }
  const transformResult = transformSaveFromServer(parseResult.data);
  if (!transformResult.success) {
    return {
      kind: "FAILURE",
    };
  }

  return {
    kind: "SUCCESS",
    data: transformResult.data,
  };
}

function transformSaveFromServer(s: SaveServer): ParseResult<SaveClient> {
  return saveClientSchema.safeParse(s);
}
