import { db } from "./db/db";
import { type IncomingMessage, type ServerResponse } from "node:http";

export const router = (req: IncomingMessage, res: ServerResponse) => {
  if (req.method === "GET" && req.url === "/api/users") {
    res.writeHead(200, { "Content-Type": "application/json" });
    const result = db.getAllUsers();
    if (result.status === "success") {
      res.end(JSON.stringify(result.users));
    } else {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Internal Server Error" }));
    }
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: `${req.url} Not Found` }));
  }
};
