import { getUserByWs, User } from "./users.js";
import { Ws } from "./ws.js";

export type Room = {
  roomId: number;
  roomUsers: User[];
};

let roomIndex = 0;
const nextRoomIndex = () => {
  roomIndex += 1;
  return roomIndex;
};

export const rooms: Map<number, Room> = new Map();

export const createRoom = (ws: Ws) => {
  const user = getUserByWs(ws);
  if (!user) {
    return null;
  }
  const room = { roomId: nextRoomIndex(), roomUsers: [user] };
  rooms.set(room.roomId, room);
  return room;
};

export const getRoom = (roomId: number) => {
  return rooms.get(roomId);
};
export const addUserToRoom = (roomId: number, ws: Ws) => {
  const user = getUserByWs(ws);
  if (!user) {
    return null;
  }
  const room = getRoom(roomId);
  if (!room) {
    return null;
  }
  room.roomUsers.push(user);
  return room;
};

export const getRooms = () => {
  return Array.from(rooms.values());
};

export const getPlayableRooms = () => {
  return getRooms()
    .filter((room) => room.roomUsers.length === 1)
    .map((room) => ({
      roomId: room.roomId,
      roomUsers: room.roomUsers.map((user) => ({
        name: user.name,
        index: user.index,
      })),
    }));
};

export const removeRoom = (roomId: number) => {
  rooms.delete(roomId);
};
