import { printPrompt } from "../prompt/prompt.js";
import { exit } from "./exit.js";

export const execute = async (data) => {
  const command = data.toString("utf-8").trim();

  switch (command) {
    case ".exit":
      exit();
      break;
    default:
      console.log(command);
  }

  printPrompt();
};
