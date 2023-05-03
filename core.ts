import { green, red } from "./deps.ts";
import type { Action, Result, RunResult, Task } from "./types.ts";

const prettyResult = (result: Result, { color = true } = {}): string => {
  const [msg, paint] = result.ok
    ? [`OK ${result.name}`, green]
    : [`Error ${result.name}: ${result.message}`, red];

  return color ? paint(msg) : msg;
};

export const defineTask = (actions: ReadonlyArray<Action>): Task => {
  const executeCheck: Task["check"] = async () => {
    const results: Array<Result> = [];
    for (const { dry } of actions) {
      results.push(await dry());
    }

    return results;
  };

  const executeRun: Task["run"] = async () => {
    const results: Array<RunResult> = [];
    for (const { dry, run } of actions) {
      const checkResult = await dry();
      if (checkResult.ok) {
        results.push({ check: checkResult });
        continue;
      }
      try {
        await run();
      } catch (e) {
        results.push({
          check: checkResult,
          run: { ok: false, name: checkResult.name, message: e?.message },
        });
        continue;
      }
      results.push({
        check: checkResult,
        run: { ok: true, name: checkResult.name },
      });
    }

    return results;
  };

  return { check: executeCheck, run: executeRun };
};

export const prettyRunResult = (
  result: RunResult,
  opt: { color?: boolean } = {}
): string => {
  const checkMsg = prettyResult(result.check, opt);
  const msg = result.check.ok
    ? checkMsg
    : `${prettyResult(result.run as Result, opt)}
  ${checkMsg}`;

  return msg;
};