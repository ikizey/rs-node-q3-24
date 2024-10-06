import { createHash } from "node:crypto";
import { printInputError } from "../../messages/inputError.js";
import { printOperationError } from "../../messages/operationError.js";
import { createReadStream } from "node:fs";
import { color } from "../../colors/colors.js";

export const hash = async (args) => {
  const pathname = getValidArg(args);
  if (!pathname) {
    printInputError();
    return false;
  }

  return new Promise((resolve) => {
    try {
      const readStream = createReadStream(pathname);
      const hash = createHash("sha256");

      readStream
        .on("data", (chunk) => {
          hash.update(chunk);
        })
        .on("end", () => {
          const fileHash = hash.digest("hex");
          console.log(
            `${color.primary}SHA256 hash: ${color.white}${fileHash}${color.reset}`
          );
          readStream.close();
          resolve(fileHash);
        })
        .on("error", (error) => {
          printOperationError();
          resolve(false);
        });
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
