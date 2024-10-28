import { WebSocket } from "ws";
import { Ws } from "./ws.js";

export type User = {
  name: string;
  password: string;
  index: number;
  wins: number;
  ws: Ws;
};

let userIndex = 0;
const nextUserIndex = () => {
  userIndex += 1;
  return userIndex;
};

export const users: Map<number, User> = new Map();

export const addUser = (name: string, password: string, ws: WebSocket) => {
  const websocket: Ws = ws as Ws;
  websocket.userIndex = nextUserIndex();
  const user = {
    name,
    password,
    index: websocket.userIndex,
    wins: 0,
    ws: websocket,
  };
  users.set(user.index, user);
  return user;
};

export const getUser = (index: number) => {
  return users.get(index);
};

export const getUserByWs = (ws: Ws) => {
  const user = Array.from(users.values()).find(
    (user) => user.ws.userIndex === ws.userIndex,
  );
  if (user) {
    return user;
  }
  return null;
};

export const getUsers = () => {
  return Array.from(users.values());
};

export const getWinners = () => {
  return getUsers().map((user) => ({
    name: user.name,
    wins: user.wins,
  }));
};

export const updateUserWins = (index: number) => {
  const user = users.get(index);
  if (user) {
    user.wins += 1;
  }
  return getWinners();
};

export const removeUser = (index: number) => {
  users.delete(index);
};
