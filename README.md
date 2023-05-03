# moira

moira is a highly customizable dotfiles manager.

note: Moira is the "three goddesses of destiny" in Greek mythology.

## Usage

```ts
import {
  defineTask,
  exec,
  home,
  link,
  printCheckResults,
} from "https://deno.land/x/moira@v0.1.0";

if (!home) throw new Error("$HOME is not set");

const deploy = defineTask([
  link({
    source: "./home/.zshenv",
    destination: `${home}/.zshenv`,
  }),
  link({
    source: "./home/config/zsh/.zshrc",
    destination: `${home}/.config/zsh/.zshrc`,
  }),
]);

const setup = defineTask([
  exec({
    cmd: "pacman",
    args: ["-S", "--needed", "base-devel", "git"],
  }),
  exec({
    cmd: "git",
    args: ["clone", "https://aur.archlinux.org/paru.git"],
  }),
  exec({
    cmd: "cd",
    args: ["paru"],
  }),
  exec({
    cmd: "makepkg",
    args: ["-si"],
  }),
  exec({
    cmd: "cd",
    args: [".."],
  }),
  exec({
    cmd: "rm",
    args: ["-rf", "paru"],
  }),
]);

if (Deno.args.includes("deploy")) {
  if (Deno.args.includes("run")) {
    await deploy.run();
  } else {
    printCheckResults(await deploy.check());
  }
} else if (Deno.args.includes("setup")) {
  if (Deno.args.includes("run")) {
    await setup.run();
  } else {
    printCheckResults(await setup.check());
  }
} else {
  console.log(`unknown commands: ${Deno.args}`);
  Deno.exit(1);
}
```
