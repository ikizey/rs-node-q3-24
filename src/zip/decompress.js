import { createReadStream, createWriteStream } from 'node:fs';
import { createGunzip } from 'node:zlib';
import { pipeline } from 'node:stream/promises';
import { join } from 'node:path';

const decompress = async () => {
    const inputPath = join('src', 'zip', 'files', 'fileToDecompress.gz');
    const outputPath = join('src', 'zip', 'files', 'decompressed.txt');
    const errorMessage = 'Decompression failed';

    try {
        const readableStream = createReadStream(inputPath);
        const writableStream = createWriteStream(outputPath);
        const gunzipStream = createGunzip();

        await pipeline(readableStream, gunzipStream, writableStream);
    } catch (error) {
        throw new Error(errorMessage);
    }
};

await decompress();