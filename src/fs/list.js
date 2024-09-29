import { promises as fs } from "node:fs";
import path from "node:path";

const list = async () => {
    const folderPath = path.join("src", "fs", "files");
    const errorMessage = "FS operation failed";

    try {
        const files = await fs.readdir(folderPath);
        console.log(files);
    } catch (error) {
        throw new Error(errorMessage);
    }
};

await list();