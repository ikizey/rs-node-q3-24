import { ls } from "./ls.js";
import { printPrompt } from "../prompt/prompt.js";
import { exit } from "./exit.js";
import { printInputError } from "../messages/inputError.js";
import { cd } from "./cd.js";

export const execute = async (data) => {
  const command = data.toString("utf-8").trim();

  if (command === ".exit") {
    exit();
  } else if (command.startsWith("cd ")) {
    await cd(command);
  } else if (command === "ls") {
    await ls();
  } else {
    printInputError();
  }

  printPrompt();
};
