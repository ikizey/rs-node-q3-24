import { ls } from "./ls.js";
import { printPrompt } from "../prompt/prompt.js";
import { exit } from "./exit.js";

export const execute = async (data) => {
  const command = data.toString("utf-8").trim();

  if (command === ".exit") {
      exit();
  } else if (command === "ls") {
      await ls();
  } else {
      console.log(command);
  }

  printPrompt();
};
