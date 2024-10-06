import { Transform } from "node:stream";
import { pipeline } from "node:stream/promises";

const transform = async () => {
  const transformReverse = new Transform({
    transform(buffer, encoding, callback) {
      const reversed =
        buffer.toString("utf-8").split("").reverse().join("") + "\n\n";

      callback(null, reversed);
    },
  });

  await pipeline(process.stdin, transformReverse, process.stdout);
};

await transform();
