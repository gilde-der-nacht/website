import { z } from "astro/zod";

const issueSchema = z.object({
  code: z.string(),
  message: z.string(),
});

export type LeafIssue = z.infer<typeof issueSchema>;

export type LeafValidated<F> =
  | { readonly status: "SUCCESS"; readonly data: F }
  | { readonly status: "ERROR"; readonly issues: ReadonlyArray<LeafIssue> }
  | { readonly status: "UNTRUSTED"; readonly issues: ReadonlyArray<LeafIssue> };

export type FieldView<R, F> = {
  readonly kind: "FIELD";
  readonly raw: R;
  readonly validated: LeafValidated<F>;
};

export function field<R, F>(config: {
  readonly raw: z.ZodType<R>;
  readonly domain: z.ZodType<F>;
}) {
  const wire = z.object({
    kind: z.literal("FIELD"),
    raw: config.raw,
    validated: z.discriminatedUnion("status", [
      z.object({ status: z.literal("SUCCESS"), data: z.unknown() }),
      z.object({ status: z.literal("ERROR"), issues: z.array(issueSchema) }),
    ]),
  });

  return wire.transform((leaf): FieldView<R, F> => {
    if (leaf.validated.status === "ERROR") {
      return {
        kind: "FIELD",
        raw: leaf.raw,
        validated: { status: "ERROR", issues: leaf.validated.issues },
      };
    }

    const result = config.domain.safeParse(leaf.validated.data);

    if (result.success) {
      return {
        kind: "FIELD",
        raw: leaf.raw,
        validated: { status: "SUCCESS", data: result.data },
      };
    }

    const issues: ReadonlyArray<LeafIssue> = result.error.issues.map(
      (issue) => ({
        code: `frontend.decode_failed.${issue.path.join(".") || "root"}`,
        message: issue.message,
      }),
    );

    return {
      kind: "FIELD",
      raw: leaf.raw,
      validated: { status: "UNTRUSTED", issues },
    };
  });
}

export function record<F extends Record<string, z.ZodType>>(fields: F) {
  return z.object({
    kind: z.literal("RECORD"),
    data: z.object(fields),
  });
}

export function list<S extends z.ZodType>(item: S) {
  return z.object({
    kind: z.literal("LIST"),
    data: z.array(item),
  });
}

export function defineFormView<F extends z.ZodType>(form: F) {
  return {
    schema: form,

    parse: (
      json: unknown,
    ):
      | { success: true; data: z.output<F> }
      | { success: false; error: z.ZodError } => {
      return form.safeParse(json) as
        | { success: true; data: z.output<F> }
        | { success: false; error: z.ZodError };
    },

    parseUnsafe: (json: unknown): z.output<F> => form.parse(json),
  };
}
