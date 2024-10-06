import { printInputError } from "../../messages/inputError.js";
import { printOperationError } from "../../messages/operationError.js";
import fs from "node:fs/promises";

export const rm = async (args) => {
  const pathname = getValidArg(args);
  if (!pathname) {
    printInputError();
    return false;
  }

  try {
    await fs.unlink(pathname);
    return true;
  } catch {
    printOperationError();
    return false;
  }
};

const getValidArg = (args) => {
  const pathname = args[0];
  return pathname;
};
