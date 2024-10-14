import fs from "node:fs/promises";
import path from "node:path";
import { printInputError } from "../../messages/inputError.js";
import { printOperationError } from "../../messages/operationError.js";

export const add = async (args) => {
  const pathname = getValidArg(args);
  if (!pathname) {
    printInputError();
    return false;
  }

  try {
    await fs.mkdir(path.dirname(pathname), { recursive: true });
    try {
      await fs.access(pathname, fs.constants.F_OK);
      printOperationError();
      return false;
    } catch {
      await fs.writeFile(pathname, "");
      return pathname.toString();
    }
  } catch {
    printOperationError();
    return false;
  }
};

const getValidArg = (args) => {
  if (args.length !== 1 || !args[0]) {
    return null;
  }
  return args[0];
};
