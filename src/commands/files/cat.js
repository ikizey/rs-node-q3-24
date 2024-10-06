import { createReadStream } from "node:fs";
import { printOperationError } from "../../messages/operationError.js";
import { printInputError } from "../../messages/inputError.js";

export const cat = async (args) => {
  const pathname = getValidArg(args);
  if (!pathname) {
    printInputError();
    return false;
  }

  return new Promise((resolve) => {
    try {
      const readStream = createReadStream(pathname, "utf-8");

      readStream
        .on("error", () => {
          printOperationError();
          resolve(false);
        })
        .on("end", () => {
          readStream.close();
          resolve(true);
        })
        .pipe(process.stdout);
    } catch {
      printOperationError();
      resolve(false);
    }
  });
};

const getValidArg = (args) => {
  if (args.length !== 1 || !args[0]) {
    return null;
  }
  return args[0];
};
