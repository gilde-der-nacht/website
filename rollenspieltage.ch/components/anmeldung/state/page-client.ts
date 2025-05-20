import { z } from "astro/zod";

const allPageStateSchema = z.object({
  secret: z.string(),
  showCreateMessage: z.boolean(),
});

const simplePageStateSchema = z
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
  .merge(allPageStateSchema);

const editGameroundPageStateSchema = z
  .object({
    kind: z.literal("EDIT_GAMEROUND"),
    uuid: z.string().uuid(),
  })
  .merge(allPageStateSchema);

export const pageStateSchema = z.union([
  simplePageStateSchema,
  editGameroundPageStateSchema,
]);

export type PageState = z.infer<typeof pageStateSchema>;

export function getPageState(url: URL): PageState {
  const pageParam = url.searchParams.get("page");
  const uuid = url.searchParams.get("uuid");
  const secret = url.searchParams.get("secret");
  const showCreateMessage =
    url.searchParams.get("showCreateMessage") === "true";

  if (uuid === null) {
    const parseResult = pageStateSchema.safeParse({
      kind: pageParam,
      secret,
      showCreateMessage,
    });
    if (parseResult.success) {
      return parseResult.data;
    }
    console.error(parseResult.error);
    return pageStateSchema.parse({
      kind: "CHOOSE",
      secret,
      showCreateMessage,
    });
  }

  const parseResult = pageStateSchema.safeParse({
    kind: pageParam,
    uuid,
    secret,
    showCreateMessage,
  });

  if (parseResult.success) {
    return parseResult.data;
  }

  return pageStateSchema.parse({
    kind: "CHOOSE",
    secret,
    showCreateMessage,
  });
}
