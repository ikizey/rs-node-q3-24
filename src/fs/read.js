import { promises as fs } from "node:fs";
import path from "node:path";

const read = async () => {
    const filePath = path.join("src", "fs", "files", "fileToRead.txt");
    const errorMessage = "FS operation failed";

    try {
        const content = await fs.readFile(filePath, "utf8");
        console.log(content);
    } catch (error) {
        throw new Error(errorMessage);
    }
};

await read();