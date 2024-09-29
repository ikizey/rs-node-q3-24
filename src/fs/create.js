import { promises as fs } from "node:fs";
import path from "node:path";

const create = async () => {
  const filePath = path.join("src", "fs", "files", "fresh.txt");
  const content = "I am fresh and young";
  const errorMessage = "FS operation failed";

  try {
    await fs.access(filePath, fs.constants.F_OK);
    throw new Error(errorMessage);
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw new Error(errorMessage);
    }

    try {
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, content);
    } catch (writeError) {
      throw new Error(errorMessage);
    }
  }
};

await create();
