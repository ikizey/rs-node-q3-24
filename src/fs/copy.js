import { promises as fs } from "node:fs";
import path from "node:path";

const copy = async () => {
  const sourceDir = path.join("src", "fs", "files");
  const targetDir = path.join("src", "fs", "files_copy");

  try {
    await fs.access(sourceDir);
    await fs.cp(sourceDir, targetDir, { recursive: true, errorOnExist: true, force: false });
  } catch (error) {
    throw new Error("FS operation failed");
  }
};

await copy();
