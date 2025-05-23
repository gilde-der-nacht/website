import { z } from "astro/zod";

const allPageClientSchema = z.object({
  secret: z.string(),
  showCreateMessage: z.boolean(),
});

const simplePageClientSchema = z
  .object({
    kind: z.enum([
      "CHOOSE",
      "PLAYER",
      "GAMEMASTER",
      "NEW_GAMEROUND",
      "HELPING",
      "SUMMARY",
    ]),
  })
  .merge(allPageClientSchema);

const editGameroundPageClientSchema = z
  .object({
    kind: z.literal("EDIT_GAMEROUND"),
    uuid: z.string().uuid(),
  })
  .merge(allPageClientSchema);

export const pageClientSchema = z.union([
  simplePageClientSchema,
  editGameroundPageClientSchema,
]);

export type PageClient = z.infer<typeof pageClientSchema>;

export function getPageState(url: URL): PageClient {
  const pageParam = url.searchParams.get("page");
  const uuid = url.searchParams.get("uuid");
  const secret = url.searchParams.get("secret");
  const showCreateMessage =
    url.searchParams.get("showCreateMessage") === "true";

  if (uuid === null) {
    const parseResult = pageClientSchema.safeParse({
      kind: pageParam,
      secret,
      showCreateMessage,
    });
    if (parseResult.success) {
      return parseResult.data;
    }
    console.error(parseResult.error);
    return pageClientSchema.parse({
      kind: "CHOOSE",
      secret,
      showCreateMessage,
    });
  }

  const parseResult = pageClientSchema.safeParse({
    kind: pageParam,
    uuid,
    secret,
    showCreateMessage,
  });

  if (parseResult.success) {
    return parseResult.data;
  }

  return pageClientSchema.parse({
    kind: "CHOOSE",
    secret,
    showCreateMessage,
  });
}
