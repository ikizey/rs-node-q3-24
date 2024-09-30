import { createWriteStream } from "node:fs";
import { join } from "node:path";
import { pipeline } from "node:stream/promises";

const write = async () => {
  const filePath = join("src", "streams", "files", "fileToWrite.txt");
  const errorMessage = "Stream writing failed";

  try {
    const writeableStream = createWriteStream(filePath, { encoding: "utf-8" });

    await pipeline(process.stdin, writeableStream);
  } catch (error) {
    throw new Error(errorMessage);
  }
};

await write();
