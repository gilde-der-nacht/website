export type Result<T> =
  | {
      kind: "SUCCESS";
      data: T;
    }
  | {
      kind: "FAILURE";
    };
