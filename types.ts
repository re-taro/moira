type Ok = { name: string; ok: true; message?: undefined };

type Err = {
  name: string;
  ok: false;
  message: string;
};

export type Result = Ok | Err;

export type RunResult =
  | { check: Ok; run?: undefined }
  | {
      check: Err;
      run: Result;
    };

export type Action = {
  run: () => Promise<void>;
  dry: () => Promise<Result>;
};

export type Task = {
  check: () => Promise<ReadonlyArray<Result>>;
  run: () => Promise<ReadonlyArray<RunResult>>;
};
