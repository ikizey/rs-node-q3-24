import { db } from "./db/db";
import { type IncomingMessage, type ServerResponse } from "node:http";
import { validate as uuidValidate } from "uuid";
import { type UserData } from "./users/user";

export const router = (req: IncomingMessage, res: ServerResponse) => {
  if (req.method === "GET" && req.url === "/api/users") {
    const result = db.getAllUsers();
    if (result.status === "success") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(result.users));
      return;
    } else {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          error: "An unexpected error occurred. Please try again later.",
        })
      );
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

  if (req.method === "POST" && req.url === "/api/users") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        const userData: UserData = JSON.parse(body);
        const result = db.addUser(userData);
        if (result.status === "success") {
          res.writeHead(201);
          res.end(JSON.stringify(result.user));
          return;
        } else {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Invalid request body" }));
          return;
        }
      } catch (error) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            error: "An unexpected error occurred. Please try again later.",
          })
        );
        return;
      }
    });
    return;
  }

  if (req.method === "PUT" && /^\/api\/users\/[^\/]+$/.test(req.url ?? "")) {
    const userId = req.url?.split("/").pop() as string;

    if (!uuidValidate(userId)) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Invalid User ID format" }));
      return;
    }

    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        const userData: UserData = JSON.parse(body);
        const result = db.updateUser(userId, userData);
        if (result.status === "success") {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(result.user));
          return;
        } else {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "User not found" }));
          return;
        }
      } catch (error) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            error: "An unexpected error occurred. Please try again later.",
          })
        );
        return;
      }
    });
    return;
  }

  if (req.method === "DELETE" && /^\/api\/users\/[^\/]+$/.test(req.url ?? "")) {
    const userId = req.url?.split("/").pop() as string;

    if (!uuidValidate(userId)) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Invalid User ID format" }));
      return;
    }

    const result = db.deleteUser(userId);
    if (result.status === "success") {
      res.writeHead(204);
      res.end();
      return;
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "User not found" }));
      return;
    }
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: `${req.url} Page Not Found` }));
  return;
};
