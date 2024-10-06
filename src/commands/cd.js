import fs from "node:fs/promises";
import path from "node:path";
import { printInputError } from "../messages/inputError.js";
import { printOperationError } from "../messages/operationError.js";

export const cd = async (command) => {
  const args = command.split(" ");
  if (args.length !== 2 || !args[1]) {
    printInputError();
    return;
  }
  const pathArg = args[1];

  const pathname = path.resolve(pathArg);
  try {
    process.chdir(pathname);
  } catch (error) {
    printOperationError();
  }
};
