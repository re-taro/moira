import { dirname, ensureDir } from "./deps.ts";
import type { Action } from "./types.ts";

export const link = ({
  source,
  destination,
}: {
  source: string;
  destination: string;
}): Action => ({
  run: async () => {
    await ensureDir(dirname(destination));
    await Deno.symlink(await Deno.realPath(source), destination);
  },
  dry: async () => {
    let path: string;
    try {
      path = await Deno.readLink(destination);
    } catch (e) {
      return { name: destination, ok: false, message: e.message };
    }
    let sourcePath: string;
    try {
      sourcePath = await Deno.realPath(source);
    } catch (e) {
      return { name: destination, ok: false, message: e.message };
    }

    return path === sourcePath
      ? { name: destination, ok: true }
      : {
          name: destination,
          ok: false,
          message: "symlink does not point the destination",
        };
  },
});

export const write = ({
  content,
  destination,
}: {
  content: Uint8Array | string;
  destination: string;
}): Action => ({
  run: async () => {
    await ensureDir(dirname(destination));
    if (content instanceof Uint8Array) {
      await Deno.writeFile(destination, content);
    } else {
      await Deno.writeTextFile(destination, content);
    }
  },
  dry: async () => {
    try {
      await Deno.realPath(destination);
    } catch (e) {
      return { name: destination, ok: false, message: e.message };
    }
    let sourceContent;
    if (content instanceof Uint8Array) {
      sourceContent = await Deno.readFile(destination);
    } else {
      sourceContent = await Deno.readTextFile(destination);
    }

    return sourceContent === content
      ? { name: destination, ok: true }
      : { name: destination, ok: false, message: "file differs" };
  },
});
