import { createReadStream, createWriteStream } from 'node:fs';
import { createGzip } from 'node:zlib';
import { pipeline } from 'node:stream/promises';
import { join } from 'node:path';

const compress = async () => {
    const inputPath = join('src', 'zip', 'files', 'fileToCompress.txt');
    const outputPath = join('src', 'zip', 'files', 'fileToDecompress.gz');
    const errorMessage = 'Compression failed';

    try {
        const readableStream = createReadStream(inputPath);
        const writableStream = createWriteStream(outputPath);
        const gzipStream = createGzip();

        await pipeline(readableStream, gzipStream, writableStream);
    } catch (error) {
        throw new Error(errorMessage);
    }
};

await compress();