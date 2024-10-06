import { ls } from "./navigation/ls.js";
import { printPrompt } from "../prompt/prompt.js";
import { exit } from "./exit.js";
import { printInputError } from "../messages/inputError.js";
import { cd } from "./navigation/cd.js";
import { cat } from "./files/cat.js";
import { add } from "./files/add.js";
import { rn } from "./files/rn.js";

export const execute = async (data) => {
  const input = data.toString("utf-8").trim();

  const [command, ...args] = input.split(" ");

  const commands = new Map([
    [".exit", exit],
    ["cd", cd],
    ["up", () => cd([".."])],
    ["ls", ls],
    ["cat", cat],
    ["add", add],
    ["rn", rn],
  ]);

  if (commands.has(command)) {
    await commands.get(command)(args);
  } else {
    printInputError();
  }

  printPrompt();
};
