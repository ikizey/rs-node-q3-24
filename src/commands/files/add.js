import { promises as fs } from "node:fs";
import path from "node:path";
import { printInputError } from "../../messages/inputError.js";
import { printOperationError } from "../../messages/operationError.js";

export const add = async (args) => {
  const pathname = getValidArg(args);
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

const getValidArg = (args) => {
  if (args.length !== 1 || !args[0]) {
    return null;
  }
  return args[0];
};
