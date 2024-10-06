import { promises as fs } from "node:fs";
import path from "node:path";
import { printInputError } from "../../messages/inputError.js";
import { printOperationError } from "../../messages/operationError.js";

export const add = async (command) => {
  const pathname = getValidArg(command);
  if (!pathname) {
    printInputError();
    return;
  }

  try {
    await fs.mkdir(path.dirname(pathname), { recursive: true });
    try {
      await fs.access(pathname, fs.constants.F_OK);
    } catch {
      await fs.writeFile(pathname, "");
    }
  } catch {
    printOperationError();
  }
};

const getValidArg = (command) => {
  const args = command.split(" ");
  if (args.length !== 2 || !args[1]) {
    return null;
  }
  return args[1];
};
