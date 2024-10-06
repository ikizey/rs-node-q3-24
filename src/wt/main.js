import { Worker } from "node:worker_threads";
import { cpus } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const performCalculations = async () => {
  const workerPath = join(__dirname, "worker.js");
  const startNumber = 10;

  const workerPromises = cpus().map((_, index) => {
    const worker = new Worker(workerPath);

    return new Promise((resolve) => {
      worker.on("message", (result) => {
        resolve({ status: "resolved", data: result });
        worker.terminate();
      });

      worker.on("error", () => {
        resolve({ status: "error", data: null });
        worker.terminate();
      });

      worker.postMessage(startNumber + index);
    });
  });

  const results = await Promise.all(workerPromises);

  console.log(results);
};

await performCalculations();
