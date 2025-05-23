import { z } from "astro/zod";

const paramsClientSchema = z.object({
  secret: z.string(),
  showCreateMessage: z.boolean(),
});

const simplePageClientSchema = z.object({
  kind: z.enum([
    "CHOOSE",
    "PLAYER",
    "GAMEMASTER",
    "NEW_GAMEROUND",
    "HELPING",
    "SUMMARY",
  ]),
});

const editGameroundPageClientSchema = z.object({
  kind: z.literal("EDIT_GAMEROUND"),
  uuid: z.string().uuid(),
});

export const pageClientSchema = z.union([
  simplePageClientSchema,
  editGameroundPageClientSchema,
]);

export const metaClientSchema = z.union([
  simplePageClientSchema.merge(paramsClientSchema),
  editGameroundPageClientSchema.merge(paramsClientSchema),
]);

export type MetaClient = z.infer<typeof metaClientSchema>;
export type PageClient = z.infer<typeof pageClientSchema>;
export type PageKind = PageClient["kind"];

export function getMetaState(url: URL): MetaClient {
  const pageParam = url.searchParams.get("page");
  const uuid = url.searchParams.get("uuid");
  const secret = url.searchParams.get("secret");
  const showCreateMessage =
    url.searchParams.get("showCreateMessage") === "true";

  if (uuid === null) {
    const parseResult = metaClientSchema.safeParse({
      kind: pageParam,
      secret,
      showCreateMessage,
    });
    if (parseResult.success) {
      return parseResult.data;
    }
    console.error(parseResult.error);
    return metaClientSchema.parse({
      kind: "CHOOSE",
      secret,
      showCreateMessage,
    });
  }

  const parseResult = metaClientSchema.safeParse({
    kind: pageParam,
    uuid,
    secret,
    showCreateMessage,
  });

  if (parseResult.success) {
    return parseResult.data;
  }

  return metaClientSchema.parse({
    kind: "CHOOSE",
    secret,
    showCreateMessage,
  });
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
