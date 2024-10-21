import http from "http";
import { router } from "./router";

import * as dotenv from "dotenv";
dotenv.config();

const port = process.env.PORT;
if (!port) {
  throw new Error("PORT is not set");
}

async function startServer() {
  const server = http.createServer(router);

  server.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
