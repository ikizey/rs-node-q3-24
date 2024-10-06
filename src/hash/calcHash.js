import { createReadStream } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";

const calculateHash = async () => {
    const filePath = join("src", "hash", "files", "fileToCalculateHashFor.txt");
    const errorMessage = "Hash calculation failed";

    try {
        const readableStream = createReadStream(filePath);
        const hash = createHash("sha256");

        readableStream
            .on("data", (chunk) => {
                hash.update(chunk);
            })
            .on("end", () => {
                const fileHash = hash.digest("hex");
                console.log(`SHA256 hash: ${fileHash}`);
            })
            .on("error", (error) => {
                throw new Error(errorMessage);
            });
    } catch (error) {
        throw new Error(errorMessage);
    }
};

await calculateHash();