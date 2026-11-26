import { mapValues } from "@common/components/utils";
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

export interface FieldView<R, V> {
  readonly kind: "FIELD";
  readonly raw: R;
  readonly validated: LeafValidated<V>;
}

export type View =
  | FieldView<unknown, unknown>
  | { readonly [key: string]: View }
  | readonly View[];

type SchemaNode<
  W extends z.ZodType = z.ZodType,
  R extends z.ZodType = z.ZodType,
> = {
  readonly wire: W;
  readonly raw: R;
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
        kind: "FIELD" as const,
        raw: leaf.raw,
        validated: { status: "ERROR", issues: leaf.validated.issues },
      };
    }

    const result = config.parsed.safeParse(leaf.validated.data);

    if (result.success) {
      return {
        kind: "FIELD" as const,
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
      kind: "FIELD" as const,
      raw: leaf.raw,
      validated: { status: "UNTRUSTED", issues },
    };
  });
  return { wire: wireSchema, raw: config.raw };
}

export function record<
  F extends Record<string, SchemaNode<z.ZodType, z.ZodType>>,
>(
  fields: F,
): SchemaNode<
  z.ZodObject<{ [K in keyof F]: F[K]["wire"] }>,
  z.ZodObject<{ [K in keyof F]: F[K]["raw"] }>
> {
  return {
    wire: z.object(mapValues(fields, (field) => field.wire)),
    raw: z.object(mapValues(fields, (field) => field.raw)),
  };
}

export function list<I extends SchemaNode>(
  item: I,
): SchemaNode<
  z.ZodReadonly<z.ZodArray<I["wire"]>>,
  z.ZodReadonly<z.ZodArray<I["raw"]>>
> {
  return {
    wire: z.array(item.wire).readonly(),
    raw: z.array(item.raw).readonly(),
  };
}

export function defineForm<W extends z.ZodType, R extends z.ZodType>(
  form: SchemaNode<W, R>,
) {
  return {
    wireSchema: form.wire,
    rawSchema: form.raw,
  };
}
