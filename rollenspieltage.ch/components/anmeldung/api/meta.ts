import { z } from "astro/zod";

/*
 * Types
 */

const pageClientSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("CHOOSE"),
    uuid: z.null(),
  }),
  z.object({
    kind: z.literal("PLAYER"),
    uuid: z.null(),
  }),
  z.object({
    kind: z.literal("GAME"),
    uuid: z.uuid(),
  }),
  z.object({
    kind: z.literal("GAMEMASTER"),
    uuid: z.null(),
  }),
  z.object({
    kind: z.literal("HELPING"),
    uuid: z.null(),
  }),
  z.object({
    kind: z.literal("HELPING-SLOT"),
    uuid: z.uuid(),
  }),
  z.object({
    kind: z.literal("SUMMARY"),
    uuid: z.null(),
  }),
  z.object({
    kind: z.literal("EDIT_GAMEROUND"),
    uuid: z.uuid(),
  }),
]);
export type PageClient = z.infer<typeof pageClientSchema>;
const pageClientSimplifiedSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("CHOOSE"),
  }),
  z.object({
    kind: z.literal("PLAYER"),
  }),
  z.object({
    kind: z.literal("GAME"),
    uuid: z.uuid(),
  }),
  z.object({
    kind: z.literal("GAMEMASTER"),
  }),
  z.object({
    kind: z.literal("HELPING"),
  }),
  z.object({
    kind: z.literal("HELPING-SLOT"),
    uuid: z.uuid(),
  }),
  z.object({
    kind: z.literal("SUMMARY"),
  }),
  z.object({
    kind: z.literal("EDIT_GAMEROUND"),
    uuid: z.uuid(),
  }),
]);
export type PageClientSimplified = z.infer<typeof pageClientSimplifiedSchema>;
export type PageKind = PageClient["kind"];

const saveStateSchema = z.enum(["SAVING", "IDLE", "ERROR"]);
export type SaveState = z.infer<typeof saveStateSchema>;

export const metaClientSchema = z.object({
  saveState: saveStateSchema,
  page: pageClientSchema,
  secret: z.string(),
  showCreateMessage: z.boolean(),
  isDebugging: z.boolean(),
});
export type MetaClient = z.infer<typeof metaClientSchema>;

/*
 * Methods
 */

export function getMetaState(url: URL): MetaClient {
  const pageParam = url.searchParams.get("page") ?? "";
  const uuid = url.searchParams.get("uuid") ?? null;
  const secret = url.searchParams.get("secret") ?? "";
  const showCreateMessage =
    url.searchParams.get("showCreateMessage") === "true";
  const isDebugging = url.searchParams.get("debug") === "true";

  const parseResult = metaClientSchema.safeParse({
    saveState: "IDLE",
    page: {
      kind: pageParam.toUpperCase(),
      uuid,
    },
    secret,
    showCreateMessage,
    isDebugging,
  });

  if (parseResult.success) {
    return parseResult.data;
  }

  return {
    saveState: "IDLE",
    page: {
      kind: "CHOOSE",
      uuid: null,
    },
    secret,
    showCreateMessage,
    isDebugging,
  };
}

export function isSamePage(
  p1: PageClientSimplified,
  p2: PageClientSimplified,
): boolean {
  if (p1.kind !== p2.kind) {
    return false;
  }
  if (p1.kind === "EDIT_GAMEROUND" && p2.kind === "EDIT_GAMEROUND") {
    return p1.uuid === p2.uuid;
  }
  if (p1.kind === "GAME" && p2.kind === "GAME") {
    return p1.uuid === p2.uuid;
  }
  return true;
}
