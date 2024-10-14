import { printInputError } from "../../messages/inputError.js";
import { printOperationError } from "../../messages/operationError.js";
import path from "node:path";
import fs from "node:fs/promises";

export const rn = async (args) => {
  const pathArgs = getValidArgs(args);
  if (!Array.isArray(pathArgs)) {
    printInputError();
    return false;
  }

  const [oldPath, newPath] = pathArgs;

  const oldPathname = path.resolve(oldPath);
  const newPathname = path.resolve(newPath);

  try {
    try {
      await fs.access(newPathname, fs.constants.F_OK);
      printOperationError();
      return false;
    } catch {
      await fs.rename(oldPathname, newPathname);
      return [oldPathname.toString(), newPathname.toString()];
    }
  } catch {
    printOperationError();
    return false;
  }
};

const getValidArgs = (args) => {
  if (args.length !== 2 || !args[0] || !args[1]) {
    return null;
  }
  return args;
};
