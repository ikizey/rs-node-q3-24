import { promises as fs } from "node:fs";
import path from "node:path";

const rename = async () => {
    const oldPath = path.join("src", "fs", "files", "wrongFilename.txt");
    const newPath = path.join("src", "fs", "files", "properFilename.md");
    const errorMessage = "FS operation failed";

    try {
        await fs.access(oldPath, fs.constants.F_OK);

        try {
            await fs.access(newPath, fs.constants.F_OK);
            throw new Error(errorMessage);
        } catch (error) {
            if (error.code !== "ENOENT") {
                throw new Error(errorMessage);
            }
        }

        await fs.rename(oldPath, newPath);
    } catch (error) {
        throw new Error(errorMessage);
    }
};

await rename();