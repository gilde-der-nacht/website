import { mapValues } from "@common/utils/shared";
import { z } from "astro/zod";

const issueSchema = z.object({
  code: z.string(),
  message: z.string(),
});

export type LeafIssue = z.infer<typeof issueSchema>;

export type LeafValidated<V> =
  | { readonly status: "SUCCESS"; readonly data: V }
  | { readonly status: "ERROR"; readonly issues: ReadonlyArray<LeafIssue> }
  | { readonly status: "UNTRUSTED"; readonly issues: ReadonlyArray<LeafIssue> };

export type FieldView<R, V> = {
  readonly raw: R;
  readonly validated: LeafValidated<V>;
};

export function field<R, V>(config: {
  readonly raw: z.ZodType<R>;
  readonly parsed: z.ZodType<V>;
}) {
  const wire = z.object({
    raw: config.raw,
    validated: z.discriminatedUnion("status", [
      z.object({ status: z.literal("SUCCESS"), data: z.unknown() }),
      z.object({ status: z.literal("ERROR"), issues: z.array(issueSchema) }),
    ]),
  });

  const wireSchema = wire.transform((leaf): FieldView<R, V> => {
    if (leaf.validated.status === "ERROR") {
      return {
        raw: leaf.raw,
        validated: { status: "ERROR", issues: leaf.validated.issues },
      };
    }

    const result = config.parsed.safeParse(leaf.validated.data);

    if (result.success) {
      return {
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
      raw: leaf.raw,
      validated: { status: "UNTRUSTED", issues },
    };
  });
  return wireSchema;
}

export function record<W extends Record<string, z.ZodType>>(fields: W) {
  return z.object(fields);
}

export function list<W extends z.ZodType>(item: W) {
  return z.array(item);
}

export function defineForm<W extends z.ZodType>(form: W) {
  return {
    wireSchema: form,
  };
}
