import { createReadStream } from "node:fs";
import { join } from "node:path";

const read = async () => {
  const filePath = join("src", "streams", "files", "fileToRead.txt");
  const errorMessage = "Stream reading failed";

  try {
    const readableStream = createReadStream(filePath, {
      encoding: "utf-8",
    });

    readableStream
      .on("end", () => {
        process.stdout.write("\n");
      })
      .pipe(process.stdout);
  } catch (error) {
    throw new Error(errorMessage);
  }
};

await read();
