import fs from "node:fs/promises";
import { createReadStream, createWriteStream } from "node:fs";
import { createBrotliCompress } from "node:zlib";
import { pipeline } from "node:stream";
import { printInputError } from "../../messages/inputError.js";
import { printOperationError } from "../../messages/operationError.js";
import path from "node:path";

export const compress = (args) => {
  const pathArgs = getValidArgs(args);
  if (!Array.isArray(pathArgs)) {
    printInputError();
    return false;
  }

  return new Promise(async (resolve) => {
    try {
      const [sourcePath, destinationPath] = pathArgs;

      const sourcePathname = path.resolve(sourcePath);
      const destinationPathname = path.resolve(destinationPath);

      try {
        await fs.access(destinationPathname, fs.constants.F_OK);
        printOperationError();
        resolve(false);
      } catch {
        const brotliCompress = createBrotliCompress();
        const readStream = createReadStream(sourcePathname);
        const writeStream = createWriteStream(destinationPathname);

        pipeline(readStream, brotliCompress, writeStream, (err) => {
          if (err) {
            printOperationError();
            resolve(false);
          } else {
            resolve([sourcePathname, destinationPathname]);
          }
        });
      }
    } catch (error) {
      console.log(error);
      printOperationError();
      resolve(false);
    }
  });
};

const getValidArgs = (args) => {
  if (args.length !== 2 || !args[0] || !args[1]) {
    return null;
  }
  return args;
};
