import { z } from "astro/zod";

/*
 * Types
 */

const pageClientSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("CHOOSE") }),
  z.object({ kind: z.literal("PLAYER") }),
  z.object({ kind: z.literal("GAMEMASTER") }),
  z.object({ kind: z.literal("NEW_GAMEROUND") }),
  z.object({ kind: z.literal("HELPING") }),
  z.object({ kind: z.literal("SUMMARY") }),
  z.object({
    kind: z.literal("EDIT_GAMEROUND"),
    uuid: z.string().uuid(),
  }),
]);
export type PageClient = z.infer<typeof pageClientSchema>;
export type PageKind = PageClient["kind"];

export const metaClientSchema = z.object({
  page: pageClientSchema,
  secret: z.string(),
  showCreateMessage: z.boolean(),
});
export type MetaClient = z.infer<typeof metaClientSchema>;

/*
 * Methods
 */

export function getMetaState(url: URL): MetaClient {
  const pageParam = url.searchParams.get("page") ?? "";
  const uuid = url.searchParams.get("uuid") ?? undefined;
  const secret = url.searchParams.get("secret") ?? "";
  const showCreateMessage =
    url.searchParams.get("showCreateMessage") === "true";

  const parseResult = metaClientSchema.safeParse({
    page: {
      kind: pageParam.toUpperCase(),
      uuid,
    },
    secret,
    showCreateMessage,
  });

  if (parseResult.success) {
    return parseResult.data;
  }

  return {
    page: {
      kind: "CHOOSE",
    },
    secret,
    showCreateMessage,
  };
}

export function isSamePage(p1: PageClient, p2: PageClient): boolean {
  if (p1.kind !== p2.kind) {
    return false;
  }
  if (p1.kind !== "EDIT_GAMEROUND" || p2.kind !== "EDIT_GAMEROUND") {
    return true;
  }
  return p1.uuid === p2.uuid;
}
