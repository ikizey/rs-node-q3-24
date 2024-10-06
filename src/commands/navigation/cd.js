import fs from "node:fs/promises";
import path from "node:path";
import { printInputError } from "../../messages/inputError.js";
import { printOperationError } from "../../messages/operationError.js";

export const cd = async (args) => {
  const pathArg = getValidArg(args);
  if (!pathArg) {
    printInputError();
    return;
  }

  const pathname = path.resolve(pathArg);
  try {
    process.chdir(pathname);
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
