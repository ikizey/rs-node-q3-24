import { WebSocket } from "ws";

export interface Ws extends WebSocket {
  userIndex: number;
}
