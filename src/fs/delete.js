import { promises as fs } from "node:fs";
import path from "node:path";

const remove = async () => {
  const filePath = path.join("src", "fs", "files", "fileToRemove.txt");
  const errorMessage = "FS operation failed";

  try {
    await fs.unlink(filePath);
  } catch (error) {
    throw new Error(errorMessage);
  }
};

await remove();
