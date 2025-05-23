export type Result<T> =
  | {
      kind: "SUCCESS";
      data: T;
    }
  | {
      kind: "FAILURE";
    };

export type ParseResult<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
    };
