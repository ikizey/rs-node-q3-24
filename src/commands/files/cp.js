import fs from "node:fs/promises";
import { createReadStream, createWriteStream } from "node:fs";
import { printInputError } from "../../messages/inputError.js";
import { printOperationError } from "../../messages/operationError.js";
import path from "node:path";

export const cp = async (args) => {
  const pathArgs = getValidArgs(args);
  if (!Array.isArray(pathArgs)) {
    printInputError();
    return;
  }

  try {
    const [sourcePath, destinationDirPath] = pathArgs;

    const sourcePathname = path.resolve(sourcePath);

    const destinationDirPathname = path.resolve(destinationDirPath);
    const sourceFileNameWithExtension = path.basename(sourcePathname);
    const destinationPathname = path.join(
      destinationDirPathname,
      sourceFileNameWithExtension
    );

    try {
      await fs.access(destinationPathname, fs.constants.F_OK);
      printOperationError();
      return;
    } catch {
      const readStream = createReadStream(sourcePathname);
      const writeStream = createWriteStream(destinationPathname);

      readStream.pipe(writeStream);
      return;
    }
  } catch {
    printOperationError();
    return;
  }
};

const getValidArgs = (args) => {
  if (args.length !== 2 || !args[0] || !args[1]) {
    return null;
  }
  return args;
};
