import { db } from "./db/db";
import { type IncomingMessage, type ServerResponse } from "node:http";
import { validate as uuidValidate } from "uuid";

export const router = (req: IncomingMessage, res: ServerResponse) => {
  if (req.method === "GET" && req.url === "/api/users") {
    const result = db.getAllUsers();
    if (result.status === "success") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(result.users));
      return;
    } else {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Internal Server Error" }));
      return;
    }
  }

  if (req.method === "GET" && /^\/api\/users\/[^\/]+$/.test(req.url ?? "")) {
    const userId = req.url?.split("/").pop() as string;

    if (!uuidValidate(userId)) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Invalid User ID format" }));
      return;
    }

    const result = db.getUserById(userId);
    if (result.status === "error") {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "User not found" }));
      return;
    }

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(result.user));
    return;
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: `${req.url} Page Not Found` }));
  return;
};
