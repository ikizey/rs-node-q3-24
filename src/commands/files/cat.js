import fs from "node:fs";
import { printOperationError } from "../../messages/operationError.js";
import { printInputError } from "../../messages/inputError.js";

export const cat = async (command) => {
  const pathname = getValidArg(command);
  if (!pathname) {
    printInputError();
    return;
  }

  return new Promise((resolve) => {
    try {
      const readStream = fs.createReadStream(pathname, "utf-8");

      readStream
        .on("error", () => {
          printOperationError();
          resolve();
        })
        .on("end", () => {
          readStream.close();
          resolve();
        })
        .pipe(process.stdout);
    } catch {
      printOperationError();
      resolve();
    }
  });
};

const getValidArg = (command) => {
  const args = command.split(" ");
  if (args.length !== 2 || !args[1]) {
    return null;
  }
  return args[1];
};
