import { ls } from "./navigation/ls.js";
import { printPrompt } from "../prompt/prompt.js";
import { exit } from "./exit.js";
import { printInputError } from "../messages/inputError.js";
import { cd } from "./navigation/cd.js";
import { cat } from "./files/cat.js";

export const execute = async (data) => {
  const command = data.toString("utf-8").trim();

  if (command === ".exit") {
    exit();
  } else if (command.startsWith("cd ")) {
    await cd(command);
  } else if (command === "up") {
    await cd("cd ..");
  } else if (command === "ls") {
    await ls();
  } else if (command.startsWith("cat ")) {
    await cat(command);
  } else {
    printInputError();
  }

  printPrompt();
};
